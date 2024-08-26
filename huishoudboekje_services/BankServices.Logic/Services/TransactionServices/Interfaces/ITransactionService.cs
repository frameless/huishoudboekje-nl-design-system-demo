using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.Interfaces;

public interface ITransactionService
{
  public Task<Paged<ITransactionModel>> GetPaged(Pagination pagination, TransactionsFilter? filter);

  Task<IList<ITransactionModel>> GetAll(TransactionsFilter? filter);

  Task UpdateIsReconciled(IList<string> messageIds, bool isReconciled);
}
