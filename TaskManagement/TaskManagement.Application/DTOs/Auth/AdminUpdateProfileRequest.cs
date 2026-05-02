namespace TaskManagement.Application.DTOs.Auth;

public class AdminUpdateProfileRequest
{
    public Guid TargetUserId { get; set; }
    public string? Username { get; set; }
    public string? NewPassword { get; set; }
}