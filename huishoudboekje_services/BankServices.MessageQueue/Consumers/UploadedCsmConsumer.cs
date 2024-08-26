using BankServices.Logic.Services.CsmServices.Interfaces;
using Core.CommunicationModels.Files;
using MassTransit;

namespace BankServices.MessageQueue.Consumers;

public class UploadedCsmConsumer(ICsmParserService parserService) : IConsumer<UploadedCsmMessage>
{
  public async Task Consume(ConsumeContext<UploadedCsmMessage> context)
  {
    await parserService.Parse(context.Message.UploadedFile);
  }
}
