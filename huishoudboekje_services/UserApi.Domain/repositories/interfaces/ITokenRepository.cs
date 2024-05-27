namespace UserApi.Domain.repositories.interfaces;

public interface ITokenRepository
{
  public Task InsertToken(string token, string secret);

  public Task<string?> GetTokenSecret(string token);
}
