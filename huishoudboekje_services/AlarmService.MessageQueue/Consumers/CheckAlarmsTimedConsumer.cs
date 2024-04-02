using AlarmService.Logic.Controllers.Evaluation;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckAlarmsTimedConsumer(IEvaluationController evaluationController, ILogger<CheckAlarmsTimedConsumer> logger)
  : IConsumer<CheckAlarmsTimed>
{
  public async Task Consume(ConsumeContext<CheckAlarmsTimed> context)
  {
    await evaluationController.EvaluateMissingTransactionAlarms();
  }
}
