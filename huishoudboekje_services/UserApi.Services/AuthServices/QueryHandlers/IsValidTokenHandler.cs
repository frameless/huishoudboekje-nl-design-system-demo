using System.Security.Cryptography;
using System.Text;
using Core.ErrorHandling.Exceptions;
using UserApi.Domain.repositories.interfaces;
using UserApi.Services.AuthServices.Queries;
using UserApi.Services.Interfaces;

namespace UserApi.Services.AuthServices.QueryHandlers;

internal class IsValidTokenHandler(ITokenRepository tokenRepository) : IQueryHandler<IsValidToken, bool>
{
  public async Task<bool> HandleAsync(IsValidToken query)
  {
    string? secret = await tokenRepository.GetTokenSecret(query.Token);
    if (secret == null)
    {
      throw new HHBAuthorizationException("Invalid token", "No access");
    }
    string ip = CheckIpAddress(query.Ip);
    string check = GenerateTokenHash(secret, ip);
    return check.Equals(query.Token);
  }

  private static string GenerateTokenHash(string uuid, string? ip)
  {
    byte[] data = SHA256.HashData(Encoding.ASCII.GetBytes(uuid + ip));
    StringBuilder stringBuilder = new();
    foreach (byte t in data)
    {
      stringBuilder.Append(t.ToString("x2"));
    }
    return stringBuilder.ToString();
  }

  private string CheckIpAddress(string? queryIpAddress)
  {
    if (queryIpAddress == null)
    {
      throw new HHBInvalidInputException($"No ip found", "Incorrect request");
    }
    return queryIpAddress;
  }
}
