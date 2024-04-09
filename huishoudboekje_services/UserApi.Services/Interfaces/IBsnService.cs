namespace UserApi.Services.Interfaces;

public interface IBsnService
{
  public bool Validate(string bsn);
  public Task<bool> IsAllowed(string bsn);
}
