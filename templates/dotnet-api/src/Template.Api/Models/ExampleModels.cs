namespace Template.Api.Models;

/// <summary>
/// Example response DTO. Replace with your domain models.
/// </summary>
public record ExampleResponse(Guid Id, string Name, DateTimeOffset CreatedAt);

/// <summary>
/// Example request DTO.
/// </summary>
public record CreateExampleRequest(string Name);
