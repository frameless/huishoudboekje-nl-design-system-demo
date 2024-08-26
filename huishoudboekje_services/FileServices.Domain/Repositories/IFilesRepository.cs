using Core.CommunicationModels;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;

namespace FileServices.Domain.Repositories;

public interface IFilesRepository
{
  public Task<bool> FileExists(string sha256);
  public Task<IHhbFile> Insert(IHhbFile hhbFile);
  public Task Delete(string uuid);

  public Task<IList<IHhbFile>> GetMultipleById(IList<string> uuids);
}
