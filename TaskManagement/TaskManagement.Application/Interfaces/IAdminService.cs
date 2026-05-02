using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Admin;

namespace TaskManagement.Application.Interfaces;

public interface IAdminService
{
    Task<ServiceResult<PagedResult<UserResponse>>> GetUsersAsync(UserQueryRequest query);
    Task<ServiceResult<UserResponse>> UpdateRoleAsync(Guid userId, string role);
    Task<ServiceResult<bool>> DeleteUserAsync(Guid userId);
}