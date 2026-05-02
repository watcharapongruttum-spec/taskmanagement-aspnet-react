using TaskManagement.Domain.Common;

namespace TaskManagement.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public string FamilyId { get; set; } = string.Empty;
    public bool IsRevoked { get; set; } = false;
    public bool IsUsed { get; set; } = false;
    public DateTime ExpiresAt { get; set; }

    // FK
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}