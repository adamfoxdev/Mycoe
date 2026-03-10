# Copilot Instructions

<!--
  This file is read by GitHub Copilot to understand project conventions.
  Place this file at .github/copilot-instructions.md in your project.
  Customise the sections below to match your specific project.
-->

## Project Overview

This is a [React / .NET / Power BI — update as needed] project built to Mycoe CoE standards.

## Technology Stack

- **Frontend:** TypeScript, React 18, Vite, React Router v6, TanStack Query, Zustand, Fluent UI v9, MSAL
- **Backend:** .NET 8, ASP.NET Core Web API, EF Core 8, Serilog, Swashbuckle
- **Auth:** Azure AD / Entra ID via MSAL
- **Testing:** Vitest + React Testing Library (frontend) / xUnit + Moq + FluentAssertions (backend)
- **Infra:** Azure Bicep, Azure DevOps Pipelines

## Coding Conventions

### TypeScript / React

- Always use TypeScript strict mode — no `any`, use `unknown` and narrow the type
- Add explicit return types on all exported functions and components
- Use `interface` for object shapes, `type` for unions/intersections
- Component props must have a named interface (e.g., `interface UserCardProps { ... }`)
- Prefer function declarations for top-level exported components
- Use React Testing Library — test observable behaviour, not implementation details
- Import paths should use the `@/` alias for `src/` (e.g., `import { Button } from '@/components/Button'`)

### C# / .NET

- Use C# primary constructors for dependency injection
- All async methods must accept `CancellationToken cancellationToken = default`
- Use `ILogger<T>` for logging — never `Console.WriteLine`
- Return `ProblemDetails` for all error responses — never raw strings
- Async method names must end with `Async`
- Private fields use underscore prefix: `_service`

### Naming

- React components: PascalCase (e.g., `UserCard.tsx`)
- React hooks: camelCase with `use` prefix (e.g., `useCurrentUser.ts`)
- .NET classes: PascalCase (e.g., `UserController.cs`)
- .NET interfaces: `I` prefix + PascalCase (e.g., `IUserRepository`)

## What To Avoid

- `any` in TypeScript
- `Console.WriteLine` in .NET production code
- Hardcoded connection strings, secrets, or API keys anywhere
- Direct database access from controllers (use the service/repository pattern)
- Non-null assertions (`!`) in TypeScript — prefer optional chaining and guards
