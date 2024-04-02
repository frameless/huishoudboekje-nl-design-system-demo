using AlarmService.Logic.EditSignalService.Interface;
using Core.CommunicationModels.SignalModel.ConsumerMessages;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class RemoveJournalEntryFromSignalsConsumer(
  ILogger<RemoveJournalEntryFromSignalsConsumer> _logger,
  IEditSignalService editSignalService) : IConsumer<RemoveJournalEntryFromSignalMessage>
{
  public async Task Consume(ConsumeContext<RemoveJournalEntryFromSignalMessage> context)
  {
    await editSignalService.UpdateSignalsForJournalEntryRemoval(context.Message.JournalEntryIds);
  }
}
