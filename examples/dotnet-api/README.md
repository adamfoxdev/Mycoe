# Products API — .NET Starter Example

A complete, runnable ASP.NET Core 8 Web API example built to Mycoe CoE standards. Use this as the starting point for any new .NET back-end service.

## What's Included

| Feature | Implementation |
|---|---|
| REST API | ASP.NET Core 8 controllers |
| Auth | Azure AD / Entra ID via `Microsoft.Identity.Web` |
| Persistence | Entity Framework Core 8 with an in-memory provider (swap for SQL Server in production) |
| Logging | Serilog → Console + Application Insights |
| API docs | Swagger / OpenAPI via Swashbuckle |
| Health checks | `/health` and `/health/ready` endpoints |
| Unit tests | xUnit + Moq + FluentAssertions |
| Code style | `.editorconfig` aligned to CoE standards |

## Project Structure

```
examples/dotnet-api/
├── src/
│   └── ProductsApi/
│       ├── Controllers/    # HTTP entry points — thin, no business logic
│       ├── Data/           # EF Core DbContext
│       ├── Models/         # Request/response DTOs and domain entities
│       ├── Services/       # Business logic (interface + implementation)
│       ├── Program.cs      # Host bootstrap and DI wiring
│       ├── appsettings.json
│       └── appsettings.Development.json
└── tests/
    └── ProductsApi.Tests/  # xUnit unit tests for the service layer
```

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Run locally (no auth required in Development)

```bash
cd examples/dotnet-api
dotnet run --project src/ProductsApi
```

Swagger UI is available at `https://localhost:7000/swagger` when running in Development mode.

### Run tests

```bash
cd examples/dotnet-api
dotnet test
```

## Adapting This Example

1. **Rename the project** — replace `Products` with your domain noun throughout.
2. **Swap the in-memory DB** — change `UseInMemoryDatabase` to `UseSqlServer` / `UseNpgsql` in `Program.cs` and add the connection string to `appsettings.json`.
3. **Configure Azure AD** — fill in `AzureAd__TenantId` and `AzureAd__ClientId` in your environment or `appsettings.json` (never commit secrets).
4. **Add more entities** — follow the same pattern: entity → DbContext → service interface → service implementation → controller.

## References

- [CoE .NET Standards](../../docs/standards/dotnet.md)
- [.NET API Template](../../templates/dotnet-api/)
- [Azure Pipeline for .NET](../../templates/azure/pipelines/dotnet-api.yml)
