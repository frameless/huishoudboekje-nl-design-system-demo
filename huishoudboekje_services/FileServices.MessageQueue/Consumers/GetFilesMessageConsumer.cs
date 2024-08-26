using Core.CommunicationModels;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using FileServices.Logic.Services;
using MassTransit;

namespace FileServices.MessageQueue.Consumers;

public class GetFilesMessageConsumer(IHhbFileService service) : IConsumer<GetFilesMessage>
{
  public async Task Consume(ConsumeContext<GetFilesMessage> context)
  {
    await context.RespondAsync(
      new GetFilesMessageResponse()
    {
      Files = await service.GetFiles(context.Message.uuids)
    });
  }
}
