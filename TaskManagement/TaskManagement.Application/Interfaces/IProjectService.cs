using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Project;

namespace TaskManagement.Application.Interfaces;

public interface IProjectService
{
    Task<ServiceResult<ProjectResponse>> CreateAsync(CreateProjectRequest request, Guid ownerId);
    Task<ServiceResult<List<ProjectResponse>>> GetAllByOwnerAsync(Guid ownerId);
    Task<ServiceResult<ProjectResponse>> GetByIdAsync(Guid id);
    Task<ServiceResult<bool>> DeleteAsync(Guid id);
    Task<ServiceResult<ProjectResponse>> UpdateAsync(Guid id, UpdateProjectRequest request);
}