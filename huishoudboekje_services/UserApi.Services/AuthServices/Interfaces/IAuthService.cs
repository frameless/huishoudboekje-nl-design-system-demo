using Microsoft.AspNetCore.Http;

namespace UserApi.Services.AuthServices.Interfaces;

public interface IAuthService
{
  public Task<string> GenerateNewToken(string? ip, string? key);
  public Task<bool> ValidateToken(string token, string? ip);
}
