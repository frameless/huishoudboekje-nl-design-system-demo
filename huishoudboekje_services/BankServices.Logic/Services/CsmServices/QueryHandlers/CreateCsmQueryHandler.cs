using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Logic.Services.CsmServices.QueryHandlers;

public class CreateCsmQueryHandler(ICsmRepository repository) : IQueryHandler<CreateCsm, ICsm>
{
  public Task<ICsm> HandleAsync(CreateCsm query)
  {
    return repository.Insert(query.Csm);
  }
}
