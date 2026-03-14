# Tasks App — React Vite Starter Example

A complete React 18 + Vite + TypeScript single-page application built to Mycoe CoE standards. Use this as the starting point for any new React front-end project.

## What's Included

| Feature | Implementation |
|---|---|
| Build tooling | Vite 5 |
| Language | TypeScript 5 (strict mode) |
| UI components | Fluent UI v9 |
| Authentication | MSAL (Azure AD / Entra ID) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Routing | React Router v6 |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + TypeScript ESLint |
| Formatting | Prettier |

## Project Structure

```
examples/react-vite-app/
├── src/
│   ├── components/       # Shared UI components
│   │   └── TaskCard.tsx  # Example reusable component
│   ├── hooks/            # Custom React hooks
│   │   └── useTasks.ts   # Data-fetching hook using TanStack Query
│   ├── pages/            # Route-level page components
│   │   └── TasksPage.tsx # Main page showing the tasks list
│   ├── services/         # API clients and auth config
│   │   ├── authConfig.ts # MSAL config (scopes, redirects)
│   │   └── tasksApi.ts   # Typed fetch wrapper for the Tasks API
│   ├── App.tsx           # Root component with MSAL + router setup
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .eslintrc.json
└── .prettierrc
```

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- npm 10+

### Install and run

```bash
cd examples/react-vite-app
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Run tests

```bash
npm test
```

### Lint and format

```bash
npm run lint
npm run format
```

## Adapting This Example

1. **Rename the domain** — replace `Task`/`tasks` throughout with your domain noun.
2. **Point to your API** — update `VITE_API_BASE_URL` in your `.env.local` file.
3. **Configure Azure AD** — update `authConfig.ts` with your tenant ID, client ID, and API scopes.
4. **Add pages** — create new files in `src/pages/` and register routes in `App.tsx`.
5. **Add components** — follow the `TaskCard.tsx` pattern: typed props interface, named export, co-located test file.

## Environment Variables

Create a `.env.local` file (never commit this):

```env
VITE_API_BASE_URL=https://localhost:7000
VITE_AAD_CLIENT_ID=<your-spa-client-id>
VITE_AAD_TENANT_ID=<your-tenant-id>
VITE_AAD_API_SCOPE=api://<api-client-id>/access_as_user
```

## References

- [CoE React Standards](../../docs/standards/react.md)
- [React App Template](../../templates/react-app/)
- [Azure Pipeline for React](../../templates/azure/pipelines/react-app.yml)
