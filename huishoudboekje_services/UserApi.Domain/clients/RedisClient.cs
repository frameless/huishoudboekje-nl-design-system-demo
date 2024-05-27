using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using UserApi.Domain.clients.interfaces;

namespace UserApi.Domain.clients;

public class RedisClient : IKeyValueClient
{
  private readonly IDatabase database;

  public RedisClient(IConfiguration configuration)
  {
    if (configuration["HHB_USE_AUTH"] == "0")
    {
      return;
    }
    string connectionString =
      $"{configuration["HHB_REDIS_HOST"]}:{configuration["HHB_REDIS_PORT"]},password={configuration["HHB_REDIS_PASS"]}";
    ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connectionString);
    database = redis.GetDatabase();
  }

  public async Task<bool> InsertDataAsync(string key, string value, double expiresAfter)
  {
    return await database.StringSetAsync(key, value, TimeSpan.FromSeconds(expiresAfter));
  }

  public async Task<string?> RetrieveDataAsync(string key)
  {
    return await database.StringGetAsync(key);
  }
}
