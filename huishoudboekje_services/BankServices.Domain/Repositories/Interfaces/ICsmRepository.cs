using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Domain.Repositories.Interfaces;

public interface ICsmRepository
{
  public Task<ICsm> Insert(ICsm value);
  public Task<bool> CheckIfTransactionReferenceExists(string value);

  Task<Paged<ICsm>> GetPaged(Pagination queryPagination);

  Task SaveChanges();

  Task<ICsm> GetByIdWithTransactions(string commandId);

  Task<bool> DeleteNoSave(string requestId);
}
