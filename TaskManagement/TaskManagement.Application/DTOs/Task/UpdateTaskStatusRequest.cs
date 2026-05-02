using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.DTOs.Task;

public class UpdateTaskStatusRequest
{
    public WorkTaskStatus Status { get; set; }
}