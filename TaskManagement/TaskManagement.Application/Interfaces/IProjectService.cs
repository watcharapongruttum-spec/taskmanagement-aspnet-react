using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Project;

namespace TaskManagement.Application.Interfaces;

public interface IProjectService
{
    Task<ServiceResult<ProjectResponse>> CreateAsync(CreateProjectRequest request, Guid ownerId);
    Task<ServiceResult<List<ProjectResponse>>> GetAllByOwnerAsync(Guid ownerId);
    Task<ServiceResult<ProjectResponse>> GetByIdAsync(Guid id);
}