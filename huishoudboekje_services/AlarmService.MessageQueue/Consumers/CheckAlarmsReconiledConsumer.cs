using AlarmService.Logic.Controllers.Evaluation;
using Core.CommunicationModels.AlarmModels;
using Core.ErrorHandling.Exceptions;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.utils.InputValidation;
using Grpc.Core;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckAlarmsReconiledConsumer(IEvaluationController evaluationController, ILogger<CheckAlarmsReconiledConsumer> logger)
  : IConsumer<CheckAlarmsReconciled>
{
  public Task Consume(ConsumeContext<CheckAlarmsReconciled> context)
  {
    return CheckReconciledAlarms(context.Message);
  }

  private async Task CheckReconciledAlarms(CheckAlarmsReconciled message)
  {
    if (message != null)
    {
      await evaluationController.EvaluateReconciliatedJournalEntries(
        message.AgreementToAlarm,
        message.ReconciledJournalEntries,
        message.AlarmToCitizen);
    }
  }
}
