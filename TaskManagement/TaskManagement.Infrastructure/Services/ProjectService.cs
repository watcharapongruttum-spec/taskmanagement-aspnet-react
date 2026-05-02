using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Project;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _db;
    private readonly INotificationService _notification;

    public ProjectService(AppDbContext db, INotificationService notification)
    {
        _db = db;
        _notification = notification;
    }

    public async Task<ServiceResult<ProjectResponse>> CreateAsync(CreateProjectRequest request, Guid ownerId)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = ownerId
        };
        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        var owner = await _db.Users.FindAsync(ownerId);
        var response = MapToResponse(project, owner!.Username);

        await _notification.NotifyProjectCreatedAsync(response);  // เพิ่ม

        return ServiceResult<ProjectResponse>.Success(response);
    }

    public async Task<ServiceResult<List<ProjectResponse>>> GetAllByOwnerAsync(Guid ownerId)
    {
        var projects = await _db.Projects
            .Include(p => p.Owner)
            .Where(p => p.OwnerId == ownerId)
            .ToListAsync();
        var result = projects.Select(p => MapToResponse(p, p.Owner.Username)).ToList();
        return ServiceResult<List<ProjectResponse>>.Success(result);
    }

    public async Task<ServiceResult<ProjectResponse>> GetByIdAsync(Guid id)
    {
        var project = await _db.Projects
            .Include(p => p.Owner)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (project is null)
            return ServiceResult<ProjectResponse>.Failure("Project not found.");
        return ServiceResult<ProjectResponse>.Success(MapToResponse(project, project.Owner.Username));
    }

    private static ProjectResponse MapToResponse(Project p, string ownerUsername) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        OwnerUsername = ownerUsername,
        CreatedAt = p.CreatedAt
    };
}