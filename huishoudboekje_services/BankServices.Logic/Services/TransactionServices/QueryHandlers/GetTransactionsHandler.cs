using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.TransactionServices.Queries;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.QueryHandlers;

internal class GetTransactionsHandler(ITransactionRepository transactionRepository) : IQueryHandler<GetTransactions, IList<ITransactionModel>>
{
  public Task<IList<ITransactionModel>> HandleAsync(GetTransactions query)
  {
    return transactionRepository.GetAll(query.Filter);
  }
}
