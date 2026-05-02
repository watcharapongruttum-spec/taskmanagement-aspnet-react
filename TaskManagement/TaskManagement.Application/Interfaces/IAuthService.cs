using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Auth;

namespace TaskManagement.Application.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest request);
    Task<ServiceResult<AuthResponse>> RefreshTokenAsync(string refreshToken);
    Task<ServiceResult<bool>> LogoutAsync(string refreshToken);
    Task<ServiceResult<bool>> RevokeAllUserTokensAsync(Guid userId);
}