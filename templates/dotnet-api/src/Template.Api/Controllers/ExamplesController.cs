using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Template.Api.Models;
using Template.Api.Services;

namespace Template.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExamplesController(IExampleService exampleService, ILogger<ExamplesController> logger)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ExampleResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var items = await exampleService.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ExampleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await exampleService.GetByIdAsync(id, cancellationToken);
        if (item is null)
        {
            logger.LogWarning("Example {Id} not found.", id);
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ExampleResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreateExampleRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ProblemDetails { Title = "Name is required." });
        }

        var created = await exampleService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
