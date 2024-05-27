using System.Security.Cryptography;
using System.Text;
using Core.ErrorHandling.Exceptions;
using Microsoft.Extensions.Configuration;
using UserApi.Domain.repositories.interfaces;
using UserApi.Services.AuthServices.Queries;
using UserApi.Services.Interfaces;

namespace UserApi.Services.AuthServices.QueryHandlers;

internal class GenerateTokenHandler(IConfiguration configuration, ITokenRepository tokenRepository, ISecretGenerator secretGenerator) : IQueryHandler<GenerateToken, string>
{
  public async Task<string> HandleAsync(GenerateToken query)
  {
    string checkedProvidedKey = CheckProvidedKey(query.Key);
    string checkedIp = CheckIpAddress(query.IpAddress);
    IEnumerable<string> keys = GetPossibleKeys(configuration);
    IsValidKey(keys, checkedProvidedKey);
    string secret = secretGenerator.GenerateSecret();
    string token = GenerateToken(secret, query.IpAddress);
    await tokenRepository.InsertToken(token, secret);
    return token;
  }

  private string CheckIpAddress(string? queryIpAddress)
  {
    if (queryIpAddress == null)
    {
      throw new HHBInvalidInputException($"No ip found", "Incorrect request");
    }
    return queryIpAddress;
  }

  private static string GenerateToken(string uuid, string? ip)
  {
    byte[] data = SHA256.HashData(Encoding.ASCII.GetBytes(uuid + ip));
    StringBuilder stringBuilder = new();
    foreach (byte t in data)
    {
      stringBuilder.Append(t.ToString("x2"));
    }
    return stringBuilder.ToString();
  }

  private static void IsValidKey(IEnumerable<string> keys, string? providedKey)
  {
    if (!keys.Contains(providedKey))
    {
      throw new HHBAuthorizationException("Invalid api key provided", "No access");
    }
  }

  private static IEnumerable<string> GetPossibleKeys(IConfiguration configuration)
  {
    string? keysAsString = configuration["HHB_API_KEYS"];
    if (keysAsString == null)
    {
      throw new HHBMissingEnvironmentVariableException($"No api keys configured", "Incorrect configuration api keys");
    }
    return keysAsString.Split(';');
  }

  private static string CheckProvidedKey(string? key)
  {
    if (key == null)
    {
      throw new HHBInvalidInputException($"No api key provided", "Incorrect request");
    }
    return key;
  }
}
