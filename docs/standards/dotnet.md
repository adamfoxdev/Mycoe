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

### Overview

| Layer | Tool | Scope |
|---|---|---|
| Unit | xUnit + Moq + FluentAssertions | Application layer handlers, domain logic, services in isolation |
| Integration | xUnit + WebApplicationFactory | Full HTTP pipeline, middleware, auth, routing |
| Database integration | xUnit + Testcontainers | Real database behaviour, EF Core migrations, queries |
| Pre-commit gates | Husky (if using Git hooks) / Azure DevOps branch policy | Prevent merging failing tests |

> **xUnit vs NUnit:** The Mycoe standard is **xUnit** (no test class setup/teardown attributes, constructor/`IDisposable` pattern instead). **NUnit** is a valid alternative for teams with existing NUnit experience and is supported in CI in the same way — swap `[Fact]` for `[Test]` and `[Theory]` for `[TestCase]`. The patterns described below apply equally to both.

### Coverage Requirements

- Minimum **80% statement coverage** enforced in CI
- Configure coverage in CI with `dotnet test --collect:"XPlat Code Coverage"` and publish results via `reportgenerator`
- Focus coverage effort on the **Application** and **Domain** layers; coverage of thin controllers and generated EF migrations is less valuable

### Unit Tests (xUnit + Moq + FluentAssertions)

**Project setup** — `Template.Api.Tests.csproj` (see `tests/` in the template):

```xml
<ItemGroup>
  <PackageReference Include="xunit" Version="2.*" />
  <PackageReference Include="xunit.runner.visualstudio" Version="2.*" />
  <PackageReference Include="Moq" Version="4.*" />
  <PackageReference Include="FluentAssertions" Version="6.*" />
  <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
  <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="8.*" />
</ItemGroup>
```

**Handler unit test example:**

```csharp
public class GetUserByIdHandlerTests
{
    private readonly Mock<IUserRepository> _repository = new();

    [Fact]
    public async Task Handle_ReturnsUserDto_WhenUserExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _repository.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
                   .ReturnsAsync(new User { Id = userId, Name = "Alice" });

        var handler = new GetUserByIdHandler(_repository.Object);

        // Act
        var result = await handler.Handle(new GetUserByIdQuery(userId), CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Alice"); // ! suppresses null warning: Should().NotBeNull() above guarantees non-null
    }

    [Fact]
    public async Task Handle_ReturnsNull_WhenUserDoesNotExist()
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
                   .ReturnsAsync((User?)null);

        var handler = new GetUserByIdHandler(_repository.Object);

        var result = await handler.Handle(new GetUserByIdQuery(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeNull();
    }
}
```

**FluentAssertions patterns:**

```csharp
// Collections
result.Should().HaveCount(3);
result.Should().ContainSingle(u => u.Name == "Alice");
result.Should().BeEquivalentTo(expected, opts => opts.Excluding(x => x.CreatedAt));

// Exceptions
var act = () => sut.ProcessAsync(null!);
await act.Should().ThrowAsync<ArgumentNullException>().WithParameterName("request");

// Dates
result.CreatedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromSeconds(5));
```

**NUnit equivalent** (for teams using NUnit):

```csharp
[TestFixture]
public class GetUserByIdHandlerTests
{
    private Mock<IUserRepository> _repository;
    private GetUserByIdHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _repository = new Mock<IUserRepository>();
        _handler = new GetUserByIdHandler(_repository.Object);
    }

    [Test]
    public async Task Handle_ReturnsUserDto_WhenUserExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _repository.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
                   .ReturnsAsync(new User { Id = userId, Name = "Alice" });

        // Act
        var result = await _handler.Handle(new GetUserByIdQuery(userId), CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Alice");
    }
}
```

**Parameterised tests (data-driven):**

```csharp
// xUnit Theory
[Theory]
[InlineData("")]
[InlineData("   ")]
[InlineData(null)]
public async Task CreateAsync_Throws_WhenNameIsNullOrWhitespace(string? name)
{
    var act = () => sut.CreateAsync(new CreateExampleRequest(name!));
    await act.Should().ThrowAsync<ValidationException>();
}

// NUnit equivalent
[TestCase("")]
[TestCase("   ")]
[TestCase(null)]
public async Task CreateAsync_Throws_WhenNameIsNullOrWhitespace(string? name) { ... }
```

### Integration Tests (WebApplicationFactory)

Use `Microsoft.AspNetCore.Mvc.Testing` to spin up the full ASP.NET Core pipeline in memory for HTTP-level integration tests.

```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.*" />
```

```csharp
public class UsersEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public UsersEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace real services with test doubles
                services.AddSingleton<IUserRepository, InMemoryUserRepository>();
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetUser_Returns200_WithValidId()
    {
        var response = await _client.GetAsync("/api/users/well-known-test-id");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUser_Returns404_WhenUserDoesNotExist()
    {
        var response = await _client.GetAsync($"/api/users/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
```

**Bypassing authentication in integration tests:**

```csharp
factory.WithWebHostBuilder(builder =>
{
    builder.ConfigureTestServices(services =>
    {
        services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", _ => { });
    });
});
```

### Database Integration Tests (Testcontainers)

Use **Testcontainers** to spin up a real SQL Server (or PostgreSQL) container for EF Core tests that must validate migration correctness and complex queries.

```xml
<PackageReference Include="Testcontainers.MsSql" Version="3.*" />
```

```csharp
public class UserRepositoryTests : IAsyncLifetime
{
    private readonly MsSqlContainer _container = new MsSqlBuilder().Build();
    private AppDbContext _dbContext = null!;

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(_container.GetConnectionString())
            .Options;
        _dbContext = new AppDbContext(options);
        await _dbContext.Database.MigrateAsync();
    }

    public async Task DisposeAsync()
    {
        await _dbContext.DisposeAsync();
        await _container.DisposeAsync();
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsUser_AfterInsert()
    {
        var user = new User { Id = Guid.NewGuid(), Name = "Alice" };
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        var repo = new UserRepository(_dbContext);
        var result = await repo.GetByIdAsync(user.Id, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Alice");
    }
}
```

> **Note:** Testcontainers requires Docker to be running. In CI (Azure DevOps), ensure the agent has Docker available (use a `ubuntu-latest` or `windows-latest` hosted agent and add a Docker installation step if needed).

### Testing Gotchas and Recommendations

| Gotcha | Recommendation |
|---|---|
| `Moq` strict vs loose behaviour | Use `MockBehavior.Strict` on critical dependencies to catch unmocked calls; use `MockBehavior.Loose` (default) for collaborators where unexpected calls are acceptable |
| Verifying mock calls | Use `_mock.Verify(x => x.Method(...), Times.Once)` after the act step, not inside the arrange |
| `async` test methods | Always `await` the act — never use `.Result` or `.Wait()` which can deadlock |
| EF Core tracking issues in tests | Call `_dbContext.ChangeTracker.Clear()` between test operations if you reuse the same context instance |
| Integration test state leakage | Use `IClassFixture` for shared, expensive setup (factory/container); use constructor for per-test setup |
| Testing middleware ordering | Test middleware effects via `WebApplicationFactory` HTTP calls, not by calling middleware methods directly |
| Clock-dependent logic | Inject `TimeProvider` (available in .NET 8) instead of using `DateTime.UtcNow` directly — mock it in tests |
| Parallel test execution | xUnit runs test classes in parallel by default — ensure no shared static/mutable state across test classes |
| Testing background services | Use `BackgroundServiceTestHarness` or a custom hosted-service runner; do not rely on `IHostedService` starting in `WebApplicationFactory` tests |

## Health Checks

All APIs must expose:
- `GET /health` — liveness (app is running)
- `GET /health/ready` — readiness (app + dependencies are ready)

## CI/CD

Pipelines are defined in `templates/azure/pipelines/dotnet-api.yml`.
