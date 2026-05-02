using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.DTOs.Task;

public class TaskResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkTaskStatus Status { get; set; }
    public Guid ProjectId { get; set; }
    public string? AssigneeUsername { get; set; }
    public DateTime CreatedAt { get; set; }
}