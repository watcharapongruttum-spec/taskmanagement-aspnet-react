namespace TaskManagement.Application.DTOs.Project;

public class ProjectResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string OwnerUsername { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}