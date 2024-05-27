using UserApi.Producers.Interfaces;
using UserApi.Services.BsnServices.Queries;
using UserApi.Services.Interfaces;

namespace UserApi.Services.BsnServices.queryHandlers;

internal class IsBsnAllowedHandler(ICheckBsnProducer checkBsnProducer) : IQueryHandler<IsBsnAllowed, bool>
{
  public Task<bool> HandleAsync(IsBsnAllowed query)
  {
    return checkBsnProducer.RequestCheckBsn(query.Bsn);
  }
}
