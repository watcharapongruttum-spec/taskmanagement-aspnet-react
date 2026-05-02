using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Admin;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Enums;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ServiceResult<List<UserResponse>>> GetAllUsersAsync()
    {
        var users = await _db.Users
            .OrderBy(u => u.CreatedAt)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return ServiceResult<List<UserResponse>>.Success(users);
    }

    public async Task<ServiceResult<UserResponse>> UpdateRoleAsync(Guid userId, string role)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            return ServiceResult<UserResponse>.Failure("ไม่พบ User");

        if (!Enum.TryParse<UserRole>(role, true, out var userRole))
            return ServiceResult<UserResponse>.Failure("Role ไม่ถูกต้อง (ใช้ Admin หรือ Member)");

        user.Role = userRole;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return ServiceResult<UserResponse>.Success(new UserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt
        });
    }

    public async Task<ServiceResult<bool>> DeleteUserAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
            return ServiceResult<bool>.Failure("ไม่พบ User");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return ServiceResult<bool>.Success(true);
    }
}