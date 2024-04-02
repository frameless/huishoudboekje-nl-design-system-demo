using AlarmService.Logic.EditAlarmService.Interface;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class UpdateEndDateAlarmConsumer(
  ILogger<UpdateEndDateAlarmConsumer> _logger,
  IEditAlarmService editAlarmService) : IConsumer<UpdateEndDateAlarmConsumerMessage>
{
  public async Task Consume(ConsumeContext<UpdateEndDateAlarmConsumerMessage> context)
  {
    await editAlarmService.UpdateEndDateAlarm(context.Message.AlarmUuid, context.Message.EndDateUnix);
  }
}
