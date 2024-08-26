using Core.CommunicationModels;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;

namespace FileServices.Logic.Services;

public interface IHhbFileService
{
  public Task<IHhbFile> UploadFile(IHhbFile hhbFile);
  public Task<IList<IHhbFile>> GetFiles(IList<string> uuids);
  public Task DeleteFile(string uuid);
}
