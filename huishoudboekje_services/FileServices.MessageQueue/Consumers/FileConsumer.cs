using Core.CommunicationModels.Files.Interfaces;
using FileServices.Logic.Services;
using MassTransit;

namespace FileServices.MessageQueue.Consumers;

public class FileConsumer(IHhbFileService service) : IConsumer<IHhbFile>
{
  public async Task Consume(ConsumeContext<IHhbFile> context)
  {
    IHhbFile uploadedFile = await service.UploadFile(context.Message);
    await context.RespondAsync(uploadedFile);
  }
}
