using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using Core.CommunicationModels.AlarmModels;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckSaldosConsumer(IEvaluatorService evaluatorService, ILogger<CheckAlarmsReconiledConsumer> logger)
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
        await evaluatorService.EvaluateCitizenSaldos(
          message.AffectedCitizens,
          message.SaldoThreshold);
    }
  }
}
