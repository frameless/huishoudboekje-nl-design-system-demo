using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using FileServices.Logic.Services.PaymentInstructionServices;
using MassTransit;

namespace FileServices.MessageQueue.Consumers;

public class CreatePaymentExportConsumer(IPaymentInstructionsService service) : IConsumer<CreatePaymentExportMessage>
{
  public async Task Consume(ConsumeContext<CreatePaymentExportMessage> context)
  {
    IHhbFile createdFile = await service.CreatePaymentInstructionsExport(context.Message.records, context.Message.ConfigurationAccountConfig);
    await context.RespondAsync(
      new CreatePaymentExportResponse()
      {
        createdExportFile = createdFile
      });
  }
}
