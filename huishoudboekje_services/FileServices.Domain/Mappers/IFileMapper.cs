using Core.CommunicationModels;
using Core.CommunicationModels.Files.Interfaces;
using File = FileServices.Domain.Contexts.Models.File;

namespace FileServices.Domain.Mappers;

public interface IFileMapper
{
  public File GetDatabaseObject(IHhbFile communicationModel);

  public IHhbFile GetCommunicationModel(File databaseObject);

  public IList<IHhbFile> GetCommunicationModels(IList<File> files);
}
