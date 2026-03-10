# .NET Standards

This document defines standards for all .NET backend services built within Mycoe.

## Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| Runtime | .NET 8 (LTS) | Long-term support, latest performance improvements |
| API Framework | ASP.NET Core Web API | Mature, well-supported |
| ORM | Entity Framework Core 8 | Code-first migrations, LINQ support |
| Authentication | Microsoft.Identity.Web | Azure AD / Entra ID integration |
| Validation | FluentValidation | Separation of validation logic |
| Logging | Serilog → Azure Application Insights | Structured logging |
| Testing | xUnit + Moq + FluentAssertions | Standard .NET testing stack |
| API Documentation | Swashbuckle (Swagger/OpenAPI) | Auto-generated API docs |
| Health Checks | `Microsoft.Extensions.Diagnostics.HealthChecks` | Required for Azure App Service / AKS |

## Solution Structure

```
MyService/
├── src/
│   ├── MyService.Api/          # Presentation layer (controllers, middleware, program.cs)
│   ├── MyService.Application/  # Business logic (commands, queries, handlers)
│   ├── MyService.Domain/       # Domain models and interfaces (no external dependencies)
│   └── MyService.Infrastructure/ # Data access, external service clients
├── tests/
│   ├── MyService.Api.Tests/
│   ├── MyService.Application.Tests/
│   └── MyService.Integration.Tests/
├── MyService.sln
├── Directory.Build.props        # Shared MSBuild properties
├── global.json                  # SDK version pin
└── .editorconfig                # Editor/formatting rules
```

This follows a **Clean Architecture** approach. Dependencies point inward — `Infrastructure` and `Api` depend on `Application` and `Domain`, never the other way around.

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Namespaces | `<Company>.<Product>.<Layer>` | `Mycoe.UserService.Application` |
| Classes | PascalCase | `UserController` |
| Interfaces | Prefix `I` + PascalCase | `IUserRepository` |
| Methods | PascalCase | `GetUserByIdAsync` |
| Private fields | Underscore prefix + camelCase | `_userRepository` |
| Constants | PascalCase | `MaxRetryCount` |
| Async methods | Suffix `Async` | `CreateOrderAsync` |

## Coding Standards

- Use **record types** for DTOs and value objects
- Use **primary constructors** (.NET 8+) for services with dependencies
- Enable **nullable reference types** (`<Nullable>enable</Nullable>`) and resolve all warnings
- Keep controllers **thin** — delegate all business logic to the Application layer
- Use **cancellation tokens** in all async methods that call external resources
- Use **`ILogger<T>`** — never `Console.WriteLine` in production code
- Avoid `async void` — always return `Task` or `Task<T>`

## Controller Example

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(IMediator mediator) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetUserByIdQuery(id), cancellationToken);
        return result is null ? NotFound() : Ok(result);
    }
}
```

## Error Handling

- Use a **global exception handler middleware** (included in the template via `app.UseExceptionHandler`)
- Return **ProblemDetails** (`application/problem+json`) for all error responses — never return plain strings
- Log unhandled exceptions as `Error` level with full context

## Authentication & Authorization

- All APIs must be protected — no unauthenticated endpoints unless explicitly justified
- Use `[Authorize]` globally via `AddAuthorization` policy in `Program.cs`
- Use **scope-based** and **role-based** authorization via Azure AD app roles
- Never log or persist JWT tokens

## Configuration

- Use the standard **Options pattern** (`IOptions<T>`)
- Store secrets in **Azure Key Vault** — never in `appsettings.json` or environment variables in production
- Reference Key Vault from Azure App Configuration or directly via the `Azure.Extensions.AspNetCore.Configuration.Secrets` package

## Database / EF Core

- Use **code-first migrations**; never modify the database schema manually
- Apply migrations via CI/CD pipeline, not at application startup
- Use **asynchronous EF Core methods** (`ToListAsync`, `FirstOrDefaultAsync`, etc.)
- Define indexes and constraints in `OnModelCreating`, not via data annotations on domain models

## Testing Standards

- Minimum **80% statement coverage** enforced in CI
- Unit-test Application layer handlers in isolation using mocks
- Use **WebApplicationFactory** for integration tests against the API layer
- Use **Testcontainers** for integration tests that need a real database

## Health Checks

All APIs must expose:
- `GET /health` — liveness (app is running)
- `GET /health/ready` — readiness (app + dependencies are ready)

## CI/CD

Pipelines are defined in `templates/azure/pipelines/dotnet-api.yml`.
