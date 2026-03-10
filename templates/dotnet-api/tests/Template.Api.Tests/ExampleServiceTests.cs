using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Template.Api.Models;
using Template.Api.Services;

namespace Template.Api.Tests;

public class ExampleServiceTests
{
    private static ExampleService CreateSut() =>
        new(NullLogger<ExampleService>.Instance);

    [Fact]
    public async Task GetAllAsync_ReturnsEmptyList_WhenNoItemsCreated()
    {
        var sut = CreateSut();

        var result = await sut.GetAllAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task CreateAsync_ReturnsCreatedItem_WithGeneratedId()
    {
        var sut = CreateSut();
        var request = new CreateExampleRequest("Test Item");

        var result = await sut.CreateAsync(request);

        result.Id.Should().NotBeEmpty();
        result.Name.Should().Be("Test Item");
        result.CreatedAt.Should().BeCloseTo(DateTimeOffset.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsItem_WhenItExists()
    {
        var sut = CreateSut();
        var created = await sut.CreateAsync(new CreateExampleRequest("Find Me"));

        var result = await sut.GetByIdAsync(created.Id);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Find Me");
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenItemDoesNotExist()
    {
        var sut = CreateSut();

        var result = await sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllCreatedItems()
    {
        var sut = CreateSut();
        await sut.CreateAsync(new CreateExampleRequest("First"));
        await sut.CreateAsync(new CreateExampleRequest("Second"));

        var result = await sut.GetAllAsync();

        result.Should().HaveCount(2);
    }
}
