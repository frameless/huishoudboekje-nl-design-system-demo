using BankServices.Logic.Producers;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions;
using MassTransit;

namespace BankServices.MessageQueue.Producers;

public class FileProducer(IRequestClient<IHhbFile> hhbFileRequestClient, IRequestClient<GetFilesMessage> filesRequestClient, IPublishEndpoint publishEndpoint) : IFileProducer
{
  public async Task<IHhbFile> Upload(IHhbFile upload)
  {
    Response<FileUploadResponse> response = await hhbFileRequestClient.GetResponse<FileUploadResponse>(upload);
    //TODO better error handling across services
    if (response.Message.Error != null)
    {
      throw new HHBInvalidInputException(response.Message.Error, response.Message.Error);
    }
    if (response.Message.File == null)
    {
      throw new HHBDataException("unexpected error when uploading file.", "unexpected error when uploading file.");
    }
    return response.Message.File;
  }

  public Task Delete(string uuid)
  {
    DeleteFile deleteMessage = new()
    {
      uuid = uuid
    };
    return publishEndpoint.Publish(deleteMessage);
  }

  public async Task<IList<IHhbFile>> GetFiles(IList<string> uuids)
  {
    GetFilesMessage request = new()
    {
      uuids = uuids,
    };
    Response<GetFilesMessageResponse> response = await filesRequestClient.GetResponse<GetFilesMessageResponse>(request);
    return response.Message.Files;
  }
}
