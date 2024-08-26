using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.TransactionServices.Queries;

namespace BankServices.Logic.Services.TransactionServices.QueryHandlers;

internal class UpdateIsReconciledHandler(ITransactionRepository transactionRepository) : IQueryHandler<UpdateIsReconciled, bool>
{
  public Task<bool> HandleAsync(UpdateIsReconciled query)
  {
    return transactionRepository.UpdateIsReconciled(query.Ids, query.IsReconciled);
  }
}

