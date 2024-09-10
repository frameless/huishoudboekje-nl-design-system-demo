using AlarmService.Logic.Services.AlarmServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class UpdateAlarmAmountConsumer(
  ILogger<UpdateAlarmAmountConsumer> _logger,
  IAlarmService alarmService) : IConsumer<UpdateAlarmAmountMessage>
{
  public async Task Consume(ConsumeContext<UpdateAlarmAmountMessage> context)
  {
    UpdateModel updateModel = new()
    {
      Uuid = context.Message.AlarmUuid,
      Updates = new Dictionary<string, object> { { nameof(IAlarmModel.Amount), context.Message.Amount } }
    };
    await alarmService.Update(updateModel);
  }
}
