# React Standards

This document defines standards for all React applications built within Mycoe.

## Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Language | TypeScript (strict) | Type safety, better DX, catches bugs early |
| Build Tool | Vite | Fast dev server and build |
| Routing | React Router v6 | De-facto standard |
| State Management | Zustand (local) / React Query (server) | Lightweight; React Query for async server state |
| Styling | CSS Modules or Tailwind CSS | Scoped styles; avoid global CSS conflicts |
| UI Component Library | Microsoft Fluent UI v9 | Consistent with Microsoft 365 ecosystem |
| Testing | Vitest + React Testing Library | Fast, Vite-native test runner |
| Linting | ESLint (+ `@typescript-eslint`, `react`, `react-hooks`) | Enforced via CI |
| Formatting | Prettier | Non-negotiable; enforced via CI |
| Authentication | MSAL.js (`@azure/msal-react`) | Azure AD / Entra ID SSO |

## Folder Structure

```
src/
├── components/       # Shared, dumb/presentational components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── index.ts
├── hooks/            # Custom React hooks
├── pages/            # Route-level page components
├── services/         # API clients, external service abstractions
├── store/            # Zustand stores
├── types/            # Shared TypeScript interfaces and types
├── utils/            # Pure utility functions
├── App.tsx
└── main.tsx
```

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase, prefix `use` | `useCurrentUser.ts` |
| Services | camelCase | `userService.ts` |
| Types / Interfaces | PascalCase | `UserProfile` |
| Zustand stores | camelCase, suffix `Store` | `authStore.ts` |
| CSS modules | camelCase | `styles.module.css` |
| Test files | Same name as subject, `.test.tsx` | `UserCard.test.tsx` |

## TypeScript Rules

- Enable **strict mode** in `tsconfig.json`
- No `any` — use `unknown` and narrow the type
- Prefer `interface` over `type` for object shapes
- Use explicit return types on all exported functions
- Avoid non-null assertions (`!`) — use optional chaining and guards

## Component Guidelines

```tsx
// ✅ Good: Props interface, explicit return type, no any
interface UserCardProps {
  userId: string;
  onSelect: (id: string) => void;
}

export function UserCard({ userId, onSelect }: UserCardProps): JSX.Element {
  // ...
}
```

```tsx
// ❌ Avoid: implicit any, no explicit return type
export function UserCard(props: any) {
  // ...
}
```

- Prefer function declarations over arrow function components for top-level exports
- Keep components small — if a component exceeds ~150 lines, consider splitting it
- Co-locate test files with the component they test

## State Management

- Use **local `useState`/`useReducer`** for UI-only state
- Use **React Query** (`@tanstack/react-query`) for server-fetched data
- Use **Zustand** only when state needs to be shared across unrelated components
- Never store sensitive data (tokens, PII) in Zustand or localStorage

## Authentication (Azure AD / Entra ID)

All apps must authenticate via MSAL. Use the template in `templates/react-app` which includes the MSAL provider setup.

```tsx
// src/main.tsx — MSAL bootstrapping is already set up in the template
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './services/authService';
```

- Acquire tokens silently with `useMsal` — never hardcode credentials
- Scope tokens to the minimum required permissions

## API Communication

- All API calls go through a service module in `src/services/`
- Use `fetch` or `axios` — do not scatter fetch calls across components
- Always handle loading, error, and empty states

## Testing Standards

### Overview

| Layer | Tool | Scope |
|---|---|---|
| Unit / Component | Vitest + React Testing Library | Hooks, utilities, individual components |
| Integration | Vitest + React Testing Library | Page-level components with mocked services |
| End-to-End | Playwright | Critical user journeys in a real browser |
| Pre-commit gates | Husky + lint-staged | Lint and type-check before every commit |

### Coverage Requirements

- Minimum **80% statement, branch, function and line coverage** enforced in CI via `vitest run --coverage`
- Coverage thresholds are configured in `vite.config.ts` and will fail the build if not met
- Aim for **100% coverage of utility functions and custom hooks** — these are pure logic with no rendering cost

### Unit and Component Tests (Vitest + React Testing Library)

Use **Vitest** as the test runner (it is Vite-native and shares the same config) and **React Testing Library** to interact with components through the DOM the same way a user would.

**Setup files** — `src/test-setup.ts` imports `@testing-library/jest-dom` matchers so you can use `toBeInTheDocument()`, `toHaveValue()`, etc.:

```ts
// src/test-setup.ts
import '@testing-library/jest-dom';
```

**Component test example:**

```tsx
// src/components/UserCard/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('displays the user name', () => {
    render(<UserCard userId="1" name="Alice" onSelect={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls onSelect with the user id when clicked', async () => {
    const onSelect = vi.fn();
    render(<UserCard userId="42" name="Bob" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /select/i }));
    expect(onSelect).toHaveBeenCalledWith('42');
  });
});
```

**Custom hook test example:**

```tsx
// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

**Key principles:**

- Query by **role, label, or visible text** — never by `data-testid` unless there is no accessible alternative
- Use `userEvent` from `@testing-library/user-event` for interactions (simulates real browser events), not `fireEvent`
- Test **observable behaviour**, not internal state or implementation details
- Wrap async operations with `await` + `waitFor` / `findBy*` queries
- Mock only at the **service boundary** — mock `src/services/userService.ts`, not internal fetch calls

**Mocking modules:**

```tsx
// Mock the entire service module
vi.mock('@/services/userService', () => ({
  getUser: vi.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
}));
```

**Mocking React Query / server state:**

Wrap the component under test in a `QueryClientProvider` with a fresh `QueryClient` per test to avoid state leaking between tests:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function queryClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      {children}
    </QueryClientProvider>
  );
}

render(<UserList />, { wrapper: queryClientWrapper });
```

**Mocking MSAL authentication:**

Use `@azure/msal-react`'s `MsalProvider` with a mocked `PublicClientApplication` or a simple context stub:

```tsx
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ accounts: [{ username: 'test@example.com' }], instance: {} }),
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

### End-to-End Tests (Playwright)

Use **Playwright** for tests covering critical user journeys that span multiple pages or require a running back end.

**Install and configure:**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Test example:**

```ts
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in and see their dashboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /sign in/i }).click();
  // ... complete login flow
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
```

**Playwright guidelines:**

- Keep E2E tests **focused on journeys**, not individual component behaviour — leave that to Vitest
- Use **Page Object Model** for pages that appear in multiple tests
- Store test fixtures (mock API responses, test users) in `e2e/fixtures/`
- Run Playwright in CI with `npx playwright test` — reports are saved to `playwright-report/`
- Authenticate once and reuse the storage state to avoid repeated login flows per test

### Pre-commit Hooks (Husky + lint-staged)

Use **Husky** to enforce quality gates before every commit, so broken or poorly typed code never enters the repository.

**Install:**

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Configure `package.json`:**

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --max-warnings 0",
      "prettier --write"
    ]
  }
}
```

**`.husky/pre-commit`:**

```sh
#!/usr/bin/env sh
npx lint-staged
npx tsc --noEmit
```

**`.husky/pre-push`:**

```sh
#!/usr/bin/env sh
npm run test
```

This means:
- Every **commit** runs ESLint and Prettier on staged files and a TypeScript type-check
- Every **push** runs the full unit test suite

> **Gotcha:** Husky hooks only run if the `prepare` script runs after `npm install`. Ensure your `package.json` includes `"prepare": "husky"`.

### Testing Gotchas and Recommendations

| Gotcha | Recommendation |
|---|---|
| `act(...)` warnings in tests | Wrap state-updating code in `act()` or use `userEvent` (which wraps in `act` automatically) |
| Tests passing individually but failing in parallel | Ensure each test uses its own `QueryClient` / store instance — avoid shared module-level state |
| `vi.mock` hoisting issues | Place `vi.mock(...)` calls at the top of the test file, before imports, or use `vi.doMock` for dynamic mocks |
| Testing components that use `useNavigate` | Wrap in `MemoryRouter` or use `createMemoryRouter` from react-router-dom v6 |
| Async `findBy*` vs `getBy*` | Use `findBy*` for elements that appear after async operations; `getBy*` throws immediately if not found |
| Coverage gaps in error branches | Write a dedicated test that forces each error path (throw, null return, network error) |
| Mocking `window` / `localStorage` | Use `vi.stubGlobal('localStorage', {...})` or `jsdom`'s built-in `localStorage` — reset between tests |
| Playwright auth in CI | Store the signed-in browser storage state in a file and reuse with `storageState` in `playwright.config.ts` |
| Snapshot tests becoming stale | Prefer assertion-based tests over snapshot tests; if you use snapshots, update them intentionally with `--update-snapshots` |

## CI/CD

- Linting and type-check must pass before merge (`npm run lint && npm run type-check`)
- All tests must pass (`npm run test`)
- Build must succeed (`npm run build`)
- Pipelines are defined in `templates/azure/pipelines/react-app.yml`
