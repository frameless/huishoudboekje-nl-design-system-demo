using System.Security.Cryptography;
using System.Text;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using FileServices.Domain.Repositories;
using FileServices.Logic.Producers;

namespace FileServices.Logic.Services;

public class HhbFileService(IFilesRepository repository, IDateTimeProvider dateTimeProvider, INotifyProducer notifyProducer) : IHhbFileService
{
  public async Task<IHhbFile> UploadFile(IHhbFile hhbFile)
  {
    CheckIsValidFile(hhbFile);
    HhbFile upload = (HhbFile)hhbFile;
    upload.Sha256 = GetFileHAsh(hhbFile.Bytes);
    upload.UploadedAt = dateTimeProvider.UnixNow();
    await CheckFileExists(upload);
    IHhbFile uploadedFile = await repository.Insert(hhbFile);
    await notifyProducer.NotifyFileUpload(uploadedFile);
    return uploadedFile;
  }

  public Task<IList<IHhbFile>> GetFiles(IList<string> uuids)
  {
    return repository.GetMultipleById(uuids);
  }

  public Task DeleteFile(string uuid)
  {
    return repository.Delete(uuid);
  }

  private void CheckIsValidFile(IHhbFile data)
  {
    switch (data.Type)
    {
      case FileType.CustomerStatementMessage:
      case FileType.PaymentInstruction:
        CheckIsValidCsmFile(data);
        break;
      default:
        throw new HHBInvalidInputException("File type not supported", "Could not determine file type or the file type is not supported");
    }
  }

  private async Task CheckFileExists(IHhbFile upload)
  {
    if (await repository.FileExists(upload.Sha256))
    {
      throw new HHBDataException("File already exists", "The uploaded file already exists");
    }
  }

  private string GetFileHAsh(byte[] file)
  {
    byte[] data = SHA256.HashData(file);
    StringBuilder stringBuilder = new();
    foreach (byte t in data)
    {
      stringBuilder.Append(t.ToString("x2"));
    }
    return stringBuilder.ToString();
  }

  private void CheckIsValidCsmFile(IHhbFile hhbFile)
  {
    if (!IsXmlFile(hhbFile.Name))
    {
      throw new HHBInvalidInputException("File extension not supported", "The provided file is not supported");
    }
  }

  private bool IsXmlFile(string fileName)
  {
    string extension = Path.GetExtension(fileName);
    return extension.Equals(".xml", StringComparison.OrdinalIgnoreCase);
  }
}
