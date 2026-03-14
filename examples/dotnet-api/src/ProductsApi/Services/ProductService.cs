using Microsoft.EntityFrameworkCore;
using ProductsApi.Data;
using ProductsApi.Models;

namespace ProductsApi.Services;

public interface IProductService
{
    Task<IReadOnlyList<ProductResponse>> GetAllAsync(string? category = null, CancellationToken cancellationToken = default);
    Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default);
    Task<ProductResponse?> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ProductService(ProductsDbContext dbContext, ILogger<ProductService> logger) : IProductService
{
    public async Task<IReadOnlyList<ProductResponse>> GetAllAsync(string? category = null, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category == category);
        }

        var products = await query
            .OrderBy(p => p.Name)
            .Select(p => ToResponse(p))
            .ToListAsync(cancellationToken);

        logger.LogInformation("Retrieved {Count} products (category filter: {Category})", products.Count, category ?? "none");

        return products;
    }

    public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await dbContext.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        return product is null ? null : ToResponse(product);
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Name = request.Name,
            Category = request.Category,
            Price = request.Price
        };

        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Created product {Id} — {Name}", product.Id, product.Name);

        return ToResponse(product);
    }

    public async Task<ProductResponse?> UpdateAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken = default)
    {
        var product = await dbContext.Products.FindAsync([id], cancellationToken);
        if (product is null)
        {
            return null;
        }

        product.Name = request.Name;
        product.Category = request.Category;
        product.Price = request.Price;
        product.IsActive = request.IsActive;

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Updated product {Id}", id);

        return ToResponse(product);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await dbContext.Products.FindAsync([id], cancellationToken);
        if (product is null)
        {
            return false;
        }

        dbContext.Products.Remove(product);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Deleted product {Id}", id);

        return true;
    }

    private static ProductResponse ToResponse(Product p) =>
        new(p.Id, p.Name, p.Category, p.Price, p.IsActive, p.CreatedAt);
}
