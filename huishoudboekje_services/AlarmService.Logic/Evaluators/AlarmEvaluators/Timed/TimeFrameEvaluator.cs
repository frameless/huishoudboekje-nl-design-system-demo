using AlarmService.Logic.Evaluators.AlarmEvaluators.Reconciliation;
using AlarmService.Logic.Helpers;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.SignalModel;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Evaluators.AlarmEvaluators.Timed;

public class TimeFrameEvaluator(IDateTimeProvider dateTimeProvider, CheckOnDateHelper checkOnDateHelper) : BaseEvaluator<AlarmEvaluationInfo>
{
  private const int SignalTypeTimeframe = 1;

  protected override Evaluation? GetEvaluation(AlarmEvaluationInfo evaluationInfo)
  {
    if (evaluationInfo.Alarm.CheckOnDate == null) return null;
    Evaluation evaluation = new()
    {
      Alarm = (AlarmModel)evaluationInfo.Alarm
    };

    DateTime checkOnDate = dateTimeProvider.UnixToDateTime((long)evaluationInfo.Alarm.CheckOnDate);
    DateTime today = dateTimeProvider.EndOfDay(dateTimeProvider.Today());

    if (checkOnDate <= today)
    {
      SignalModel signal = new()
      {
        Type = SignalTypeTimeframe,
        IsActive = true,
        OffByAmount = -evaluationInfo.Alarm.Amount,
        CreatedAt = dateTimeProvider.UnixNow(),
        JournalEntryUuids = null,
        AlarmUuid = evaluationInfo.Alarm.UUID,
        CitizenUuid = evaluationInfo.CitizenId,
        AgreementUuid = evaluationInfo.AgreementId
      };
      evaluation.Signals.Add(new SignalResult(){Signal = signal, UpdateExisting = true});

      evaluation.NewCheckOnDate = checkOnDateHelper.DetermineNextCheckOnDate(
        dateTimeProvider.Today().AddDays(-(1 + evaluationInfo.Alarm.DateMargin)),
        evaluationInfo.Alarm);
    }
    return evaluation;
  }

  protected override string PrintError(AlarmEvaluationInfo evaluationInfo)
  {
    return dateTimeProvider.Now() + "Error evaluating timed, alarm id: " + evaluationInfo.Alarm.UUID;
  }
}
