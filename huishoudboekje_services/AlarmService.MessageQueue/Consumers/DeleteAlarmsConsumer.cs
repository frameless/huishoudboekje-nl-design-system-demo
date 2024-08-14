using AlarmService.Logic.Services.AlarmServices;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.SignalServices;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class DeleteAlarmsConsumer(ISignalService signalService, IAlarmService alarmService, ILogger<DeleteAlarmsConsumer> logger)
  : IConsumer<DeleteAlarms>
{
  public async Task Consume(ConsumeContext<DeleteAlarms> context)
  {
    if (context.Message.DeleteSignals)
    {
      await signalService.DeleteByAlarmIds(context.Message.Ids);
      if (context.Message.CitizenIds.Any())
      {
        await signalService.DeleteByCitizenIds(context.Message.CitizenIds);
      }
    }

    List<string> ids = context.Message.Ids.Where(id => id != null).ToList();
    if (ids.Any())
    {
      await alarmService.DeleteByIds(ids);
    }
  }
}
