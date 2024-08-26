using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Producers;

public interface IFileProducer
{
  public Task<IHhbFile> Upload(IHhbFile upload);
  public Task Delete(string uuid);
  public Task<IList<IHhbFile>> GetFiles(IList<string> uuids);
}
