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

- Minimum **80% statement coverage** enforced in CI
- Unit-test all custom hooks and utility functions
- Integration-test page components using React Testing Library
- Do **not** test implementation details — test observable behaviour

## CI/CD

- Linting and type-check must pass before merge (`npm run lint && npm run type-check`)
- All tests must pass (`npm run test`)
- Build must succeed (`npm run build`)
- Pipelines are defined in `templates/azure/pipelines/react-app.yml`
