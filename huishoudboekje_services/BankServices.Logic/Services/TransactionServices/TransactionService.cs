using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.TransactionServices.Interfaces;
using BankServices.Logic.Services.TransactionServices.Queries;
using BankServices.Logic.Services.TransactionServices.QueryHandlers;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices;

public class TransactionService(ITransactionRepository repository) : ITransactionService
{
  public Task<Paged<ITransactionModel>> GetPaged(Pagination pagination, TransactionsFilter? filter)
  {
    GetTransactionsPaged query = new(pagination, filter);
    GetTransactionsPagedHandler handler = new(repository);
    return handler.HandleAsync(query);
  }

  public Task<IList<ITransactionModel>> GetAll(TransactionsFilter? filter)
  {
    GetTransactions query = new(filter);
    GetTransactionsHandler handler = new(repository);
    return handler.HandleAsync(query);
  }

  public Task UpdateIsReconciled(IList<string> messageIds, bool isReconciled)
  {
    UpdateIsReconciled query = new(messageIds, isReconciled);
    UpdateIsReconciledHandler handler = new(repository);
    return handler.HandleAsync(query);
  }
}
