using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckAlarmsTimedConsumer(IEvaluatorService evaluatorService, ILogger<CheckAlarmsTimedConsumer> logger)
  : IConsumer<CheckAlarmsTimed>
{
  public async Task Consume(ConsumeContext<CheckAlarmsTimed> context)
  {
    await evaluatorService.EvaluateMissingTransactionAlarms();
  }
}
