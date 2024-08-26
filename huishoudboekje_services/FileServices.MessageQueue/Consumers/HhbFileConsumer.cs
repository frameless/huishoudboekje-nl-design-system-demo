using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions.Base;
using FileServices.Logic.Services;
using MassTransit;

namespace FileServices.MessageQueue.Consumers;

public class HhbFileConsumer(IHhbFileService service) : IConsumer<IHhbFile>
{
  public async Task Consume(ConsumeContext<IHhbFile> context)
  {
    IHhbFile file = CastMessageToIHhbFile(context);
    FileUploadResponse response = new();
    try
    {
      response.File = await service.UploadFile(file);
    }
    catch (HHBException e)
    {
      response.Error = e.ErrorMessage;
    }
    finally
    {
      await context.RespondAsync(response);
    }
  }

  private IHhbFile CastMessageToIHhbFile(ConsumeContext<IHhbFile> context)
  {
    return new HhbFile()
    {
      Bytes = context.Message.Bytes,
      Type = context.Message.Type,
      Name = context.Message.Name,
      Sha256 = context.Message.Sha256,
      Size = context.Message.Size,
      UploadedAt = context.Message.UploadedAt,
      LastModified = context.Message.LastModified,
      UUID = context.Message.UUID
    };
  }
}
