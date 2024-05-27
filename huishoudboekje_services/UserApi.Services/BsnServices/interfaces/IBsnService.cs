namespace UserApi.Services.BsnServices.interfaces;

public interface IBsnService
{
  public Task<bool> Validate(string bsn);
  public Task<bool> IsAllowed(string bsn);
}
