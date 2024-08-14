using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels.SignalModel.ConsumerMessages;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class RemoveJournalEntryFromSignalsConsumer(
  ILogger<RemoveJournalEntryFromSignalsConsumer> _logger,
  ISignalService signalService) : IConsumer<RemoveJournalEntryFromSignalMessage>
{
  public async Task Consume(ConsumeContext<RemoveJournalEntryFromSignalMessage> context)
  {
    await signalService.HandleJournalEntryDeletion(context.Message.JournalEntryIds);
  }
}
