using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.Auth;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.ErrorMessage });
        return Ok(result.Data);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (!result.IsSuccess)
            return Unauthorized(new { error = result.ErrorMessage });
        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        if (!result.IsSuccess)
            return Unauthorized(new { error = result.ErrorMessage });
        return Ok(result.Data);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RevokeTokenRequest request)
    {
        var result = await _authService.LogoutAsync(request.RefreshToken);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.ErrorMessage });
        return Ok(new { message = "Logout สำเร็จ ทุก Device ถูก kick ออกแล้ว" });
    }

    [HttpPost("revoke/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RevokeUser(Guid userId)
    {
        var result = await _authService.RevokeAllUserTokensAsync(userId);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.ErrorMessage });
        return Ok(new { message = "Revoke tokens สำเร็จ" });
    }






[HttpPut("profile")]
[Authorize]
public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
{
    var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var result = await _authService.UpdateProfileAsync(userId, request);
    if (!result.IsSuccess)
        return BadRequest(new { error = result.ErrorMessage });
    return Ok(new { message = "อัปเดต Profile สำเร็จ" });
}











}