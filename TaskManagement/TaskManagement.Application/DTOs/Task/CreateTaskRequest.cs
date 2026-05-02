namespace TaskManagement.Application.DTOs.Task;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
}