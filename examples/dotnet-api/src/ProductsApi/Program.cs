using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Services;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Structured logging via Serilog
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    // Azure AD / Entra ID JWT Bearer authentication.
    // For full Microsoft.Identity.Web integration, install the NuGet package and replace
    // AddJwtBearer with .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd")).
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = $"{builder.Configuration["AzureAd:Instance"]}{builder.Configuration["AzureAd:TenantId"]}";
            options.Audience = builder.Configuration["AzureAd:ClientId"];
        });

    builder.Services.AddAuthorization();

    // Entity Framework — uses InMemory for the example; swap for UseSqlServer in production
    builder.Services.AddDbContext<ProductsDbContext>(options =>
        options.UseInMemoryDatabase("ProductsDb"));

    // Application services
    builder.Services.AddScoped<IProductService, ProductService>();

    // Controllers + Swagger
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new() { Title = "Products API", Version = "v1" });
    });

    // Health checks
    builder.Services.AddHealthChecks();

    // CORS — configure allowed origins per environment
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy
                .WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [])
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    // Seed the in-memory database
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ProductsDbContext>();
        db.Database.EnsureCreated();
    }

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseExceptionHandler("/error");
    app.UseHttpsRedirection();
    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");
    app.MapHealthChecks("/health/ready");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}

// Expose Program for integration testing
public partial class Program { }
