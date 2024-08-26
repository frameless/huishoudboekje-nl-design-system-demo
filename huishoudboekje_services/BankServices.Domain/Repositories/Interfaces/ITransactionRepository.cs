using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Domain.Repositories.Interfaces;

public interface ITransactionRepository
{
  Task<Paged<ITransactionModel>> GetPaged(Pagination pagination, TransactionsFilter? filters);

  Task<IList<ITransactionModel>> GetAll(TransactionsFilter? queryFilter);

  Task<bool> UpdateIsReconciled(IList<string> queryIds, bool queryIsReconciled);
}
