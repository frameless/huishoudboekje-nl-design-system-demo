using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using Core.CommunicationModels.AlarmModels;
using Core.ErrorHandling.Exceptions;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.utils.InputValidation;
using Grpc.Core;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace AlarmService.MessageQueue.Consumers;

public class CheckAlarmsReconiledConsumer(IEvaluatorService evaluatorService, ILogger<CheckAlarmsReconiledConsumer> logger)
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
      await evaluatorService.EvaluateReconciliatedJournalEntries(
        message.AgreementToAlarm,
        message.ReconciledJournalEntries,
        message.AlarmToCitizen);
    }
  }
}
