using Microsoft.AspNetCore.SignalR;
using TaskManagement.Application.DTOs.Task;
using TaskManagement.Application.Interfaces;
using TaskManagement.Infrastructure.Hubs;

namespace TaskManagement.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<TaskHub> _hubContext;

    public NotificationService(IHubContext<TaskHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyTaskUpdatedAsync(Guid projectId, TaskResponse task)
    {
        await _hubContext.Clients
            .Group($"project-{projectId}")
            .SendAsync("TaskUpdated", task);
    }

    public async Task NotifyTaskCreatedAsync(Guid projectId, TaskResponse task)
    {
        await _hubContext.Clients
            .Group($"project-{projectId}")
            .SendAsync("TaskCreated", task);
    }
}