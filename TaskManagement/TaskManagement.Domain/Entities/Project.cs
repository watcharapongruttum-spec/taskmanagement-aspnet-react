using TaskManagement.Domain.Common;

namespace TaskManagement.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // FK
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    // Navigation
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}