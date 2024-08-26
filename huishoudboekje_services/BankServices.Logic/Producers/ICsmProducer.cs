using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Producers;

public interface ICsmProducer
{
  public Task<IHhbFile> Upload(IHhbFile upload);
  public Task<Paged<ICsm>> GetPaged(Pagination upload);
}
