using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using UserApi.Domain.repositories.interfaces;
using UserApi.Services.AuthServices.Interfaces;
using UserApi.Services.AuthServices.Queries;
using UserApi.Services.AuthServices.QueryHandlers;

namespace UserApi.Services.AuthServices;

public class AuthService(IConfiguration configuration, ITokenRepository tokenRepository, ISecretGenerator secretGenerator) : IAuthService
{
  public Task<string> GenerateNewToken(string?ip, string? key)
  {
    if (configuration["HHB_USE_AUTH"] == "0")
    {
      return Task.FromResult("AuthIsDisabled");
    }
    GenerateToken query = new(ip, key);
    GenerateTokenHandler handler = new(configuration, tokenRepository, secretGenerator);
    return handler.HandleAsync(query);
  }

  public Task<bool> ValidateToken(string token, string?ip)
  {
    if (configuration["HHB_USE_AUTH"] == "0")
    {
      return Task.FromResult(true);
    }
    IsValidToken query = new(token, ip);
    IsValidTokenHandler handler = new(tokenRepository);
    return handler.HandleAsync(query);
  }
}
