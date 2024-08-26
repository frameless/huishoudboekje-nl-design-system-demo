using Core.CommunicationModels;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using File = FileServices.Domain.Contexts.Models.File;

namespace FileServices.Domain.Mappers;

public class FileMapper : IFileMapper
{
  public File GetDatabaseObject(IHhbFile communicationModel)
  {
    File result = new();
    if (communicationModel.UUID != null && communicationModel.UUID != "")
    {
      result.Uuid = Guid.Parse(communicationModel.UUID);
    }
    if (communicationModel.Name != "")
    {
      result.Name = communicationModel.Name;
    }
    if (communicationModel.Sha256 != "")
    {
      result.Sha256 = communicationModel.Sha256;
    }
    if (communicationModel.Size != 0)
    {
      result.Size = (int)communicationModel.Size;
    }
    if (communicationModel.UploadedAt != 0)
    {
      result.UploadedAt = communicationModel.UploadedAt;
    }
    if (communicationModel.LastModified != 0)
    {
      result.LastModified = communicationModel.LastModified;
    }
    if (communicationModel.Bytes.Length != 0)
    {
      result.Bytes = communicationModel.Bytes;
    }
    if (communicationModel.Type != null)
    {
      result.Type = (int)communicationModel.Type;
    }
    return result;
  }

  public IHhbFile GetCommunicationModel(File databaseObject)
  {
    HhbFile result = new();
    result.UUID = databaseObject.Uuid.ToString();
    if (databaseObject.Name != "")
    {
      result.Name = databaseObject.Name;
    }
    if (databaseObject.Sha256 != "")
    {
      result.Sha256 = databaseObject.Sha256;
    }
    if (databaseObject.Size != 0)
    {
      result.Size = databaseObject.Size;
    }
    if (databaseObject.UploadedAt != 0)
    {
      result.UploadedAt = databaseObject.UploadedAt;
    }
    if (databaseObject.LastModified != 0)
    {
      result.LastModified = databaseObject.LastModified;
    }
    if (databaseObject.Bytes.Length != 0)
    {
      result.Bytes = databaseObject.Bytes;
    }
    if (databaseObject.Type != null)
    {
      result.Type = (FileType)databaseObject.Type;
    }
    return result;
  }
  public IList<IHhbFile> GetCommunicationModels(IList<File> files)
  {
    return files.Select(GetCommunicationModel).ToList();
  }
}
