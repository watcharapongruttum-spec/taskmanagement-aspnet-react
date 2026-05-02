using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Task;

namespace TaskManagement.Application.Interfaces;

public interface ITaskService
{
    Task<ServiceResult<TaskResponse>> CreateAsync(CreateTaskRequest request);
    Task<ServiceResult<List<TaskResponse>>> GetByProjectAsync(Guid projectId);
    Task<ServiceResult<TaskResponse>> UpdateStatusAsync(Guid taskId, UpdateTaskStatusRequest request);
    Task<ServiceResult<bool>> DeleteAsync(Guid taskId);
}