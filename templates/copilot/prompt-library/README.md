# Copilot Prompt Library

A collection of reusable prompts for GitHub Copilot Chat to accelerate common development tasks.
Use these in the Copilot Chat panel with `@workspace` for best results.

---

## React Prompts

### Generate a new component

```
Create a new React component called `<ComponentName>` in TypeScript.
- It should follow the Mycoe CoE React standards (see docs/standards/react.md)
- Props must have a named interface `<ComponentName>Props`
- Use Fluent UI v9 components where applicable
- Include an export from an `index.ts` barrel file
- Include a co-located test file using React Testing Library and Vitest
```

### Add a React Query hook for an API endpoint

```
Create a custom React Query hook called `use<Resource>` that fetches from `GET /api/<resource>`.
- Use `useQuery` from `@tanstack/react-query`
- Use the `useApiToken` hook to get the bearer token
- Define the response type as a TypeScript interface `<Resource>Response`
- Handle loading, error, and empty states
- Place the hook in `src/hooks/use<Resource>.ts`
```

### Write unit tests for a component

```
Write Vitest + React Testing Library unit tests for the `<ComponentName>` component.
- Test all user-observable behaviours (not implementation details)
- Test error and loading states if applicable
- Use `userEvent` for interaction testing
- Mock external dependencies (e.g., API calls) appropriately
```

---

## .NET Prompts

### Generate a new controller

```
Create a new ASP.NET Core API controller called `<Resource>Controller` in C#.
- Follow the Mycoe CoE .NET standards (see docs/standards/dotnet.md)
- Use constructor injection with primary constructors
- Inject `I<Resource>Service` and `ILogger<<Resource>Controller>`
- Implement GET (list), GET by ID, and POST endpoints
- Return ProblemDetails for error responses
- Use `[Authorize]` and `CancellationToken` on all endpoints
- Add ProducesResponseType attributes
```

### Generate a service and interface

```
Create a service interface `I<Resource>Service` and its implementation `<Resource>Service` in C#.
- Follow Clean Architecture: service lives in the Application layer
- Interface methods must be async and accept CancellationToken
- Use `ILogger<<Resource>Service>` for logging
- Include XML summary comments on the interface methods
```

### Write xUnit tests for a service

```
Write xUnit tests for `<ServiceName>` using Moq and FluentAssertions.
- Test happy path, not-found, and validation failure scenarios
- Use `NullLogger<T>` or a mock logger
- Follow the Arrange/Act/Assert pattern
- Name tests as: <MethodName>_<Scenario>_<ExpectedOutcome>
```

---

## Bicep / Azure Prompts

### Generate a Bicep module

```
Create a Bicep module for an Azure <Resource Type> (e.g., Service Bus, Container Registry).
- Follow the Mycoe Azure naming conventions (see docs/standards/azure.md)
- Accept `location`, `suffix`, and `tags` as parameters
- Enable all relevant security settings (e.g., TLS, public network access disabled)
- Output the resource name and ID
- Place in templates/azure/bicep/modules/<resource-type>.bicep
```

### Add a pipeline stage

```
Add a new stage to the Azure DevOps YAML pipeline for deploying to the UAT environment.
- It should depend on the Dev deployment stage
- Use the `uat` environment (with manual approval gate)
- Reference the azure-service-connection-uat service connection
- Use the existing pattern from the Dev stage
```

---

## Security Prompts

### Review for OWASP Top 10 issues

```
Review the following code for OWASP Top 10 vulnerabilities.
For each finding:
1. Name the vulnerability category
2. Describe the specific risk in this code
3. Provide a remediation example
```

### Generate a threat model for a feature

```
Generate a STRIDE threat model for the following feature: <describe the feature>.
For each STRIDE category, list potential threats and suggested mitigations.
Format as a markdown table.
```

---

## Power BI / DAX Prompts

### Generate a time intelligence measure

```
Write a DAX measure for <metric> (e.g., "Total Revenue") that calculates:
- Current period value
- Year-to-date
- Prior year YTD
- YoY % change
Use DIVIDE for division. Format as a DAX code block.
Use Dim_Date[Date] as the date column.
```
