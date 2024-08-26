using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Interfaces;

public interface ICsmService
{
  public Task<IHhbFile> Upload(IHhbFile file);

  public Task<Paged<ICsm>> GetPaged(Pagination pagination);
  public Task<ICsm> Create(ICsm csm);

  Task<bool> TransactionReferenceExists(string transactionReference);

  Task<bool> Delete(string requestId);
}
