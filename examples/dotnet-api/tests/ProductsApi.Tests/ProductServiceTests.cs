using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using ProductsApi.Data;
using ProductsApi.Models;
using ProductsApi.Services;
using Xunit;

namespace ProductsApi.Tests;

public class ProductServiceTests : IDisposable
{
    private readonly ProductsDbContext _dbContext;
    private readonly ProductService _sut;

    public ProductServiceTests()
    {
        var options = new DbContextOptionsBuilder<ProductsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new ProductsDbContext(options);
        _dbContext.Database.EnsureCreated();
        _sut = new ProductService(_dbContext, NullLogger<ProductService>.Instance);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllProducts_WhenNoCategoryFilter()
    {
        var result = await _sut.GetAllAsync();

        // Seed data contains 4 products
        result.Should().HaveCount(4);
    }

    [Fact]
    public async Task GetAllAsync_FiltersByCategory()
    {
        var result = await _sut.GetAllAsync(category: "Electronics");

        result.Should().NotBeEmpty();
        result.Should().AllSatisfy(p => p.Category.Should().Be("Electronics"));
    }

    [Fact]
    public async Task GetAllAsync_ReturnsEmpty_WhenCategoryHasNoMatches()
    {
        var result = await _sut.GetAllAsync(category: "NonExistentCategory");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsProduct_WhenItExists()
    {
        var existing = await _sut.CreateAsync(new CreateProductRequest("Test Product", "Test", 9.99m));

        var result = await _sut.GetByIdAsync(existing.Id);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Test Product");
        result.Price.Should().Be(9.99m);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenProductDoesNotExist()
    {
        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_ReturnsCreatedProduct_WithGeneratedId()
    {
        var request = new CreateProductRequest("New Gadget", "Electronics", 199.99m);

        var result = await _sut.CreateAsync(request);

        result.Id.Should().NotBeEmpty();
        result.Name.Should().Be("New Gadget");
        result.Category.Should().Be("Electronics");
        result.Price.Should().Be(199.99m);
        result.IsActive.Should().BeTrue();
        result.CreatedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task UpdateAsync_ModifiesProduct_WhenItExists()
    {
        var created = await _sut.CreateAsync(new CreateProductRequest("Old Name", "Old Cat", 10.00m));
        var updateRequest = new UpdateProductRequest("New Name", "New Cat", 20.00m, IsActive: false);

        var result = await _sut.UpdateAsync(created.Id, updateRequest);

        result.Should().NotBeNull();
        result!.Name.Should().Be("New Name");
        result.Category.Should().Be("New Cat");
        result.Price.Should().Be(20.00m);
        result.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenProductDoesNotExist()
    {
        var request = new UpdateProductRequest("Name", "Cat", 0m, IsActive: true);

        var result = await _sut.UpdateAsync(Guid.NewGuid(), request);

        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_RemovesProduct_WhenItExists()
    {
        var created = await _sut.CreateAsync(new CreateProductRequest("To Delete", "Test", 5.00m));

        var deleted = await _sut.DeleteAsync(created.Id);
        var fetched = await _sut.GetByIdAsync(created.Id);

        deleted.Should().BeTrue();
        fetched.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenProductDoesNotExist()
    {
        var result = await _sut.DeleteAsync(Guid.NewGuid());

        result.Should().BeFalse();
    }

    public void Dispose()
    {
        _dbContext.Dispose();
        GC.SuppressFinalize(this);
    }
}
