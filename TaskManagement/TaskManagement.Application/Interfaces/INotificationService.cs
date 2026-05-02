using TaskManagement.Application.DTOs.Task;

namespace TaskManagement.Application.Interfaces;

public interface INotificationService
{
    Task NotifyTaskUpdatedAsync(Guid projectId, TaskResponse task);
    Task NotifyTaskCreatedAsync(Guid projectId, TaskResponse task);
}