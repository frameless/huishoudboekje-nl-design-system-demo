using Core.CommunicationModels.Files;
using FileServices.Logic.Services;
using MassTransit;

namespace FileServices.MessageQueue.Consumers;

public class DeleteFileConsumer(IHhbFileService service) : IConsumer<DeleteFile>
{
  public Task Consume(ConsumeContext<DeleteFile> context)
  {
    return service.DeleteFile(context.Message.uuid);
  }
}
