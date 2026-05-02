namespace TaskManagement.Application.DTOs.Auth;

public class UpdateProfileRequest
{
    public string? Username { get; set; }
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
}