using Template.Api.Models;

namespace Template.Api.Services;

public interface IExampleService
{
    Task<IReadOnlyList<ExampleResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ExampleResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ExampleResponse> CreateAsync(CreateExampleRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Placeholder service implementation. Replace with real business logic.
/// </summary>
public class ExampleService(ILogger<ExampleService> logger) : IExampleService
{
    private readonly List<ExampleResponse> _store = [];

    public Task<IReadOnlyList<ExampleResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Fetching all examples. Count: {Count}", _store.Count);
        return Task.FromResult<IReadOnlyList<ExampleResponse>>(_store.AsReadOnly());
    }

    public Task<ExampleResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = _store.FirstOrDefault(e => e.Id == id);
        return Task.FromResult(item);
    }

    public Task<ExampleResponse> CreateAsync(CreateExampleRequest request, CancellationToken cancellationToken = default)
    {
        var response = new ExampleResponse(Guid.NewGuid(), request.Name, DateTimeOffset.UtcNow);
        _store.Add(response);
        logger.LogInformation("Created example {Id}", response.Id);
        return Task.FromResult(response);
    }
}
