using AlarmService.Logic.Controllers.Evaluation;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckSaldosConsumer(IEvaluationController evaluationController, ILogger<CheckAlarmsReconiledConsumer> logger)
  : IConsumer<CheckSaldos>
{
  public Task Consume(ConsumeContext<CheckSaldos> context)
  {
    return CheckSaldos(context.Message);
  }

  private async Task CheckSaldos(CheckSaldos message)
  {
    if (message != null)
    {
        await evaluationController.EvaluateBurgerSaldos(
          message.AffectedCitizens,
          message.SaldoThreshold);
    }
  }
}
