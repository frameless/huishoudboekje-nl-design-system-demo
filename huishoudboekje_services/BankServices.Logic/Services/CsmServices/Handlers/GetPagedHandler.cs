using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Logic.Services.CsmServices.Handlers;

internal class GetPagedHandler(ICsmProducer csmProducer) : IQueryHandler<GetPaged, Paged<ICsm>>
{
  public Task<Paged<ICsm>> HandleAsync(GetPaged query)
  {
    return csmProducer.GetPaged(query.Pagination);
  }
}
