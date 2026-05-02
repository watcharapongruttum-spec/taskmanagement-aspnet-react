using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Task;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _db;
    private readonly INotificationService _notification;

    public TaskService(AppDbContext db, INotificationService notification)
    {
        _db = db;
        _notification = notification;
    }

    public async Task<ServiceResult<TaskResponse>> CreateAsync(CreateTaskRequest request)
    {
        var projectExists = await _db.Projects.AnyAsync(p => p.Id == request.ProjectId);
        if (!projectExists)
            return ServiceResult<TaskResponse>.Failure("Project not found.");

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            AssigneeId = request.AssigneeId
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        var response = await MapToResponseAsync(task);
        await _notification.NotifyTaskCreatedAsync(request.ProjectId, response);

        return ServiceResult<TaskResponse>.Success(response);
    }

    public async Task<ServiceResult<List<TaskResponse>>> GetByProjectAsync(Guid projectId)
    {
        var tasks = await _db.Tasks
            .Include(t => t.Assignee)
            .Where(t => t.ProjectId == projectId)
            .ToListAsync();

        var result = new List<TaskResponse>();
        foreach (var t in tasks)
            result.Add(await MapToResponseAsync(t));

        return ServiceResult<List<TaskResponse>>.Success(result);
    }

    public async Task<ServiceResult<TaskResponse>> UpdateStatusAsync(Guid taskId, UpdateTaskStatusRequest request)
    {
        var task = await _db.Tasks
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task is null)
            return ServiceResult<TaskResponse>.Failure("Task not found.");

        task.Status = request.Status;
        task.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var response = await MapToResponseAsync(task);
        await _notification.NotifyTaskUpdatedAsync(task.ProjectId, response);

        return ServiceResult<TaskResponse>.Success(response);
    }

    private async Task<TaskResponse> MapToResponseAsync(TaskItem t)
    {
        string? assigneeUsername = null;
        if (t.AssigneeId.HasValue)
        {
            if (t.Assignee is not null)
                assigneeUsername = t.Assignee.Username;
            else
            {
                var user = await _db.Users.FindAsync(t.AssigneeId.Value);
                assigneeUsername = user?.Username;
            }
        }

        return new TaskResponse
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            ProjectId = t.ProjectId,
            AssigneeUsername = assigneeUsername,
            CreatedAt = t.CreatedAt
        };
    }

    public async Task<ServiceResult<bool>> DeleteAsync(Guid taskId)
    {
        var task = await _db.Tasks.FindAsync(taskId);
        if (task is null)
            return ServiceResult<bool>.Failure("Task not found.");
        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Success(true);
    }









public async Task<ServiceResult<TaskResponse>> UpdateAsync(Guid taskId, UpdateTaskRequest request)
{
    var task = await _db.Tasks.Include(t => t.Assignee).FirstOrDefaultAsync(t => t.Id == taskId);
    if (task is null)
        return ServiceResult<TaskResponse>.Failure("Task not found.");
    task.Title = request.Title;
    task.Description = request.Description;
    task.AssigneeId = request.AssigneeId;
    task.UpdatedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    var response = await MapToResponseAsync(task);
    await _notification.NotifyTaskUpdatedAsync(task.ProjectId, response);
    return ServiceResult<TaskResponse>.Success(response);
}




















}