using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs.Auth;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<ServiceResult<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return ServiceResult<AuthResponse>.Failure("Email นี้ถูกใช้ไปแล้ว");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return await GenerateTokensAsync(user);
    }

    public async Task<ServiceResult<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return ServiceResult<AuthResponse>.Failure("Email หรือ Password ไม่ถูกต้อง");

        return await GenerateTokensAsync(user);
    }

    public async Task<ServiceResult<AuthResponse>> RefreshTokenAsync(string refreshToken)
    {
        var token = await _db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (token == null)
            return ServiceResult<AuthResponse>.Failure("Token ไม่ถูกต้อง");

        // ถ้า token ถูกใช้ไปแล้ว = มีคนดัก token ไป → revoke ทั้ง family
        if (token.IsUsed)
        {
            await RevokeTokenFamilyAsync(token.FamilyId);
            return ServiceResult<AuthResponse>.Failure("Token ถูกใช้ไปแล้ว ระบบได้ยกเลิก session ทั้งหมด");
        }

        if (token.IsRevoked)
            return ServiceResult<AuthResponse>.Failure("Token ถูกยกเลิกแล้ว");

        if (token.ExpiresAt < DateTime.UtcNow)
            return ServiceResult<AuthResponse>.Failure("Token หมดอายุแล้ว");

        // Mark token เก่าว่าใช้ไปแล้ว
        token.IsUsed = true;
        token.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // ออก token ใหม่ใน family เดียวกัน
        return await GenerateTokensAsync(token.User, token.FamilyId);
    }

    public async Task<ServiceResult<bool>> LogoutAsync(string refreshToken)
    {
        var token = await _db.RefreshTokens
            .FirstOrDefaultAsync(r => r.Token == refreshToken);

        if (token == null)
            return ServiceResult<bool>.Failure("Token ไม่ถูกต้อง");

        // Revoke ทั้ง family = logout ทุก device
        await RevokeTokenFamilyAsync(token.FamilyId);

        return ServiceResult<bool>.Success(true);
    }

    public async Task<ServiceResult<bool>> RevokeAllUserTokensAsync(Guid userId)
    {
        var tokens = await _db.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
            token.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return ServiceResult<bool>.Success(true);
    }

    private async Task RevokeTokenFamilyAsync(string familyId)
    {
        var tokens = await _db.RefreshTokens
            .Where(r => r.FamilyId == familyId && !r.IsRevoked)
            .ToListAsync();

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
            token.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    private async Task<ServiceResult<AuthResponse>> GenerateTokensAsync(User user, string? familyId = null)
    {
        var accessToken = GenerateAccessToken(user);

        var refreshToken = new RefreshToken
        {
            Token = GenerateRandomToken(),
            FamilyId = familyId ?? Guid.NewGuid().ToString(),
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        _db.RefreshTokens.Add(refreshToken);
        await _db.SaveChangesAsync();

        return ServiceResult<AuthResponse>.Success(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString()
        });
    }

    private string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRandomToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }




public async Task<ServiceResult<bool>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
{
    var user = await _db.Users.FindAsync(userId);
    if (user is null)
        return ServiceResult<bool>.Failure("User not found.");

    if (!string.IsNullOrWhiteSpace(request.Username))
        user.Username = request.Username;

    if (!string.IsNullOrWhiteSpace(request.NewPassword))
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
            return ServiceResult<bool>.Failure("กรุณาใส่ Password เดิม");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return ServiceResult<bool>.Failure("Password เดิมไม่ถูกต้อง");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
    }

    user.UpdatedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    return ServiceResult<bool>.Success(true);
}




public async Task<ServiceResult<bool>> AdminUpdateProfileAsync(AdminUpdateProfileRequest request)
{
    var user = await _db.Users.FindAsync(request.TargetUserId);
    if (user is null)
        return ServiceResult<bool>.Failure("User not found.");

    if (!string.IsNullOrWhiteSpace(request.Username))
        user.Username = request.Username;

    if (!string.IsNullOrWhiteSpace(request.NewPassword))
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

    user.UpdatedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    return ServiceResult<bool>.Success(true);
}







}