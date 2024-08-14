using AlarmService.Logic.Services.AlarmServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class UpdateEndDateAlarmConsumer(
  ILogger<UpdateEndDateAlarmConsumer> _logger,
  IAlarmService alarmService) : IConsumer<UpdateEndDateAlarmConsumerMessage>
{
  public async Task Consume(ConsumeContext<UpdateEndDateAlarmConsumerMessage> context)
  {
    UpdateModel updateModel = new()
    {
      Uuid = context.Message.AlarmUuid,
      Updates = new Dictionary<string, object> { { nameof(IAlarmModel.EndDate), context.Message.EndDateUnix } }
    };
    await alarmService.Update(updateModel);
  }
}
