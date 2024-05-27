namespace UserApi.Domain.clients.interfaces;

public interface IKeyValueClient
{
  public Task<bool> InsertDataAsync(string key, string value, double expiresAfter);

  public Task<string?> RetrieveDataAsync(string key);
}
