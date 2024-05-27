using Core.ErrorHandling.Exceptions;
using UserApi.Producers.Interfaces;
using UserApi.Services.BsnServices.interfaces;
using UserApi.Services.BsnServices.Queries;
using UserApi.Services.BsnServices.queryHandlers;

namespace UserApi.Services.BsnServices;

public class BsnService(ICheckBsnProducer checkBsnProducer) : IBsnService
{
  public Task<bool> Validate(string bsn)
  {
    ValidateBsn query = new(bsn);
    ValidateBsnHandler handler = new();
    return handler.HandleAsync(query);
  }

  public Task<bool> IsAllowed(string bsn)
  {
    IsBsnAllowed query = new(bsn);
    IsBsnAllowedHandler handler = new(checkBsnProducer);
    return handler.HandleAsync(query);
  }
}
