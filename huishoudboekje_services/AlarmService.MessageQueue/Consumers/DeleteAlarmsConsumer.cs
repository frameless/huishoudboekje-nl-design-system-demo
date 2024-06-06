using AlarmService.Logic.Controllers.Alarm;
using AlarmService.Logic.Controllers.Signal;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class DeleteAlarmsConsumer(ISignalController signalController, IAlarmController alarmController, ILogger<DeleteAlarmsConsumer> logger)
  : IConsumer<DeleteAlarms>
{
  public async Task Consume(ConsumeContext<DeleteAlarms> context)
  {
    if (context.Message.DeleteSignals)
    {
      await signalController.DeleteByAlarmIds(context.Message.Ids);
      if (context.Message.CitizenIds.Any())
      {
        await signalController.DeleteByCitizenIds(context.Message.CitizenIds);
      }
    }

    List<string> ids = context.Message.Ids.Where(id => id != null).ToList();
    if (ids.Any())
    {
      await alarmController.DeleteByIds(ids);
    }
  }
}
