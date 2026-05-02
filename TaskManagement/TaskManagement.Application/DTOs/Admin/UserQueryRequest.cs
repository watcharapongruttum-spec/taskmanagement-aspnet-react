namespace TaskManagement.Application.DTOs.Admin;

public class UserQueryRequest
{
    public string? Search { get; set; }
    public string? Role { get; set; }     
    public string SortBy { get; set; } = "createdAt";
    public string SortDir { get; set; } = "desc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 5;
}