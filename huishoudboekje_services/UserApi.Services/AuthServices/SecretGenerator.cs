namespace UserApi.Services.AuthServices;

public class SecretGenerator : ISecretGenerator
{
  public string GenerateSecret()
  {
    return System.Guid.NewGuid().ToString();
  }
}
