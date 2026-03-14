# Copilot Instructions — Tasks App

<!--
  This file is read by GitHub Copilot to understand project conventions.
  Keep it up to date as the tech stack or standards evolve.
  Reference: https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot
-->

## Project Overview

This is a full-stack **Tasks Manager** application built to Mycoe CoE standards. It consists of:

- **Frontend:** React 18 + Vite + TypeScript SPA (`examples/react-vite-app/`)
- **Backend:** ASP.NET Core 8 Web API (`examples/dotnet-api/`)

Both layers authenticate via **Azure AD / Entra ID**.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | TypeScript 5 (strict), React 18, Vite, React Router v6, TanStack Query v5, Zustand, Fluent UI v9, MSAL v3 |
| Backend | .NET 8, ASP.NET Core Web API, EF Core 8 (InMemory / SQL Server), Serilog |
| Auth | Azure AD / Entra ID — MSAL on the SPA, JwtBearer on the API |
| Testing | Vitest + React Testing Library (frontend) / xUnit + FluentAssertions (backend) |
| Infrastructure | Azure Bicep, Azure DevOps Pipelines |

## Coding Conventions

### TypeScript / React

- Always use TypeScript **strict mode** — no `any`; use `unknown` and narrow the type
- Add **explicit return types** on all exported functions and components
- Use `interface` for object shapes, `type` for unions/intersections
- Component props must have a **named interface** (e.g., `interface TaskCardProps { ... }`)
- Prefer **function declarations** for top-level exported components
- Use React Testing Library — test observable behaviour, not implementation details
- Import paths must use the `@/` alias for `src/` (e.g., `import { TaskCard } from '@/components/TaskCard'`)
- Custom hooks live in `src/hooks/` and follow the `useXxx` naming convention

### C# / .NET

- Use **C# primary constructors** for dependency injection (e.g., `public class MyService(ILogger<MyService> logger)`)
- All async methods must accept `CancellationToken cancellationToken = default`
- Use `ILogger<T>` for logging — never `Console.WriteLine`
- Return `ProblemDetails` for all error responses — never raw strings
- Async method names must end with `Async`
- Interface names use the `I` prefix (e.g., `IProductService`)
- Controllers must be thin — all business logic belongs in the service layer

### API Design

- Use RESTful routing: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/{id}`, `DELETE /api/tasks/{id}`
- Always decorate controller actions with `[ProducesResponseType]` for every HTTP status code returned
- Validate input in the controller and return `400 BadRequest` with a `ProblemDetails` body

### Naming

- React components: `PascalCase` (e.g., `TaskCard.tsx`)
- React hooks: camelCase with `use` prefix (e.g., `useTasks.ts`)
- .NET classes: `PascalCase` (e.g., `ProductService.cs`)
- .NET interfaces: `I` prefix (e.g., `IProductService`)
- Test files: same name as the unit under test + `.test.tsx` or `Tests.cs`

## What To Avoid

- `any` in TypeScript — always use `unknown` and type guards
- `Console.WriteLine` in .NET — use `ILogger<T>`
- Hardcoded secrets, connection strings, or API keys — use environment variables or Azure Key Vault
- Direct database access from controllers — use the service/repository pattern
- Non-null assertions (`!`) in TypeScript — prefer optional chaining (`?.`) and early returns; only use `!` when the TypeScript compiler cannot narrow the type but you have verified the value is non-null at that point in the code
- Storing tokens in `localStorage` — use `sessionStorage` via MSAL's `cacheLocation` setting
- Skipping `CancellationToken` parameters on async methods

## Preferred Patterns

### New React component

```tsx
interface MyComponentProps {
  label: string;
  onClick: () => void;
}

export function MyComponent({ label, onClick }: MyComponentProps): JSX.Element {
  return <Button onClick={onClick}>{label}</Button>;
}
```

### New .NET service method

```csharp
public async Task<MyResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
{
    var entity = await _dbContext.Items.FindAsync([id], cancellationToken);
    return entity is null ? null : ToResponse(entity);
}
```

### New TanStack Query hook

```ts
export function useMyData(id: string): ReturnType<typeof useQuery> {
  const { accounts } = useMsal();
  return useQuery({
    queryKey: ['myData', id],
    queryFn: async () => {
      const token = await getToken(accounts[0]);
      return fetchMyData(id, token);
    },
    enabled: !!accounts[0],
  });
}
```
