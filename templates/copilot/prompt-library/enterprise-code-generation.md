# Enterprise Code Generation Standard (React + .NET)

Use this specification for all code you generate. The goal is **simple, clean, maintainable enterprise‑grade code**.

> **How to use:** Copy this prompt into GitHub Copilot Chat (or any coding agent) before asking it to generate code. It sets non‑negotiable engineering standards, technology expectations, and a decision‑making philosophy so the agent consistently produces high‑quality output.

---

## 🎯 Core Principles

- **Simplicity first** — choose the least complex solution that fully solves the problem.
- **Readability over cleverness** — code should be easy for a mid‑level engineer to understand.
- **Consistency** — follow established patterns; avoid one‑off styles.
- **Separation of concerns** — UI, business logic, and data access must remain cleanly separated.
- **Predictability** — no magic, no hidden side effects, no unnecessary abstractions.

---

## ⚛️ React Standards

### Component Structure

- Use **functional components** with **hooks**.
- Keep components **small and focused**.
- Extract reusable UI into separate components.
- Avoid unnecessary state; derive state when possible.

### State & Data

- Prefer **React Query** or **SWR** for server data.
- Use `useState` and `useReducer` for local state.
- Never store derived or redundant state.

### Styling

- Use **CSS Modules**, **Tailwind**, or **styled-components** (choose one per project).
- No inline styles except for trivial cases.

### API Interaction

- All API calls must go through a **typed client** (e.g., Axios instance or fetch wrapper).
- Handle loading, error, and empty states explicitly.

### Code Quality

- Use TypeScript with strict mode.
- Include clear prop types and interfaces.
- Avoid deeply nested JSX.

---

## 🏗️ .NET Standards

### Architecture

- Use **Clean Architecture** or a simple layered structure:
  - **API layer**
  - **Application layer** (business logic)
  - **Domain layer** (entities, interfaces)
  - **Infrastructure layer** (EF Core, external services)

### API Design

- Use **minimal APIs** or **controller-based APIs** depending on project style.
- Return consistent response shapes.
- Validate input using **FluentValidation** or data annotations.

### Data Access

- Use **EF Core** with:
  - Clean DbContext
  - Separate configuration classes
  - No business logic in entities

### Error Handling

- Use middleware for global exception handling.
- Never expose internal exception details.

### Code Quality

- Use dependency injection everywhere.
- Keep methods short and single‑purpose.
- Prefer interfaces only when they provide real value.

---

## 🧪 Testing Requirements

- React: test components with **React Testing Library**.
- .NET: test business logic with **xUnit** or **NUnit**.
- Write tests for:
  - Core logic
  - API endpoints
  - Critical UI flows

---

## 📦 Output Requirements

When generating code:

- Provide **complete, runnable examples**.
- Include **folder structure** when relevant.
- Add **brief comments** explaining non-obvious decisions.
- Avoid unnecessary abstractions, patterns, or frameworks.
- Prefer clarity over optimization unless performance is a stated requirement.

---

## 🧭 Decision Philosophy

When choosing between two approaches:

1. Pick the **simplest** one that meets enterprise maintainability standards.
2. Avoid premature optimization.
3. Avoid patterns that add complexity without clear benefit.
4. Prefer explicit code over implicit magic.
