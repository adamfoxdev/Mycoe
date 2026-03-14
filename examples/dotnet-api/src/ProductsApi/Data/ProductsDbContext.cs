using Microsoft.EntityFrameworkCore;
using ProductsApi.Models;

namespace ProductsApi.Data;

public class ProductsDbContext(DbContextOptions<ProductsDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).HasMaxLength(200).IsRequired();
            entity.Property(p => p.Category).HasMaxLength(100).IsRequired();
            entity.Property(p => p.Price).HasPrecision(18, 2);

            // Seed data so the API returns results without needing a real database
            entity.HasData(
                new Product { Id = new Guid("11111111-0000-0000-0000-000000000001"), Name = "Laptop Pro 15", Category = "Electronics", Price = 1299.99m },
                new Product { Id = new Guid("11111111-0000-0000-0000-000000000002"), Name = "Ergonomic Chair", Category = "Furniture", Price = 449.00m },
                new Product { Id = new Guid("11111111-0000-0000-0000-000000000003"), Name = "Standing Desk", Category = "Furniture", Price = 699.00m },
                new Product { Id = new Guid("11111111-0000-0000-0000-000000000004"), Name = "Wireless Mouse", Category = "Electronics", Price = 49.99m }
            );
        });
    }
}
