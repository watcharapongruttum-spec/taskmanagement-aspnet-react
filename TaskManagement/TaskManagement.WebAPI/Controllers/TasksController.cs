using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.Task;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request)
    {
        var result = await _taskService.CreateAsync(request);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.ErrorMessage });

        return Ok(result.Data);
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(Guid projectId)
    {
        var result = await _taskService.GetByProjectAsync(projectId);
        return Ok(result.Data);
    }

    [HttpPatch("{taskId}/status")]
    public async Task<IActionResult> UpdateStatus(Guid taskId, [FromBody] UpdateTaskStatusRequest request)
    {
        var result = await _taskService.UpdateStatusAsync(taskId, request);
        if (!result.IsSuccess)
            return NotFound(new { error = result.ErrorMessage });

        return Ok(result.Data);
    }


    [HttpDelete("{taskId}")]
    public async Task<IActionResult> Delete(Guid taskId)
    {
        var result = await _taskService.DeleteAsync(taskId);
        if (!result.IsSuccess)
            return NotFound(new { error = result.ErrorMessage });
        return NoContent();
    }
}