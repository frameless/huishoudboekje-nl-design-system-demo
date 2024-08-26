using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;

namespace BankServices.Logic.Services.CsmServices.QueryHandlers;

internal class CheckTransactionReferenceExistsHandler(ICsmRepository repository) : IQueryHandler<CheckTransactionReferenceExists, bool>
{
  public Task<bool> HandleAsync(CheckTransactionReferenceExists query)
  {
    return repository.CheckIfTransactionReferenceExists(query.transactionReference);
  }
}
