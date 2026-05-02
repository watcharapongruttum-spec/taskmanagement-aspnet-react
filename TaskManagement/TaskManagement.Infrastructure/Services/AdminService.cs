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

    public async Task<ServiceResult<PagedResult<UserResponse>>> GetUsersAsync(UserQueryRequest query)
    {
        var q = _db.Users.AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.ToLower();
            q = q.Where(u => u.Username.ToLower().Contains(s) || u.Email.ToLower().Contains(s));
        }

        // Filter role
        if (!string.IsNullOrWhiteSpace(query.Role) &&
            Enum.TryParse<UserRole>(query.Role, true, out var roleEnum))
        {
            q = q.Where(u => u.Role == roleEnum);
        }

        // Sort
        q = (query.SortBy.ToLower(), query.SortDir.ToLower()) switch
        {
            ("username", "asc")  => q.OrderBy(u => u.Username),
            ("username", _)      => q.OrderByDescending(u => u.Username),
            ("email", "asc")     => q.OrderBy(u => u.Email),
            ("email", _)         => q.OrderByDescending(u => u.Email),
            ("role", "asc")      => q.OrderBy(u => u.Role),
            ("role", _)          => q.OrderByDescending(u => u.Role),
            ("createdat", "asc") => q.OrderBy(u => u.CreatedAt),
            _                    => q.OrderByDescending(u => u.CreatedAt),
        };

        var total = await q.CountAsync();

        var items = await q
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return ServiceResult<PagedResult<UserResponse>>.Success(new PagedResult<UserResponse>
        {
            Items = items,
            Total = total,
            Page = query.Page,
            PageSize = query.PageSize
        });
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