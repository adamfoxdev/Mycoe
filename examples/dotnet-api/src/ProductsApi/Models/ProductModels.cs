namespace ProductsApi.Models;

/// <summary>
/// Domain entity stored in the database.
/// </summary>
public class Product
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Category { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
}

/// <summary>
/// Response DTO returned to API callers.
/// </summary>
public record ProductResponse(
    Guid Id,
    string Name,
    string Category,
    decimal Price,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// Request DTO for creating a new product.
/// </summary>
public record CreateProductRequest(
    string Name,
    string Category,
    decimal Price);

/// <summary>
/// Request DTO for updating an existing product.
/// </summary>
public record UpdateProductRequest(
    string Name,
    string Category,
    decimal Price,
    bool IsActive);
