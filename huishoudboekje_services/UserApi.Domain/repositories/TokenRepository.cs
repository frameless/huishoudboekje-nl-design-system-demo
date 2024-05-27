using Microsoft.Extensions.Configuration;
using UserApi.Domain.clients.interfaces;
using UserApi.Domain.repositories.interfaces;

namespace UserApi.Domain.repositories;

public class TokenRepository(IKeyValueClient keyValueClient, IConfiguration configuration) : ITokenRepository
{
  private const string TokenKeyPreFix = "user-api-tokens:";
  public Task InsertToken(string token, string secret)
  {
    string? tokenDurationString = configuration["HHB_TOKEN_DURATION"];
    double tokenDuration = string.IsNullOrEmpty(tokenDurationString) ? 30 : double.Parse(tokenDurationString);
    return keyValueClient.InsertDataAsync(TokenKeyPreFix + token, secret, tokenDuration);
  }

  public Task<string?> GetTokenSecret(string token)
  {
    return keyValueClient.RetrieveDataAsync(TokenKeyPreFix + token);
  }
}
