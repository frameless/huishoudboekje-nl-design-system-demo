using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.AlarmEvaluation.Timed;

public class TimeFrameEvaluator(IDateTimeProvider dateTimeProvider, EvaluationHelper evaluationHelper)
{
  private int SIGNAL_TYPE_TIMEFRAME = 1;

  public EvaluationResult Evaluate(IList<IAlarmModel> alarmModels, IDictionary<string, IDictionary<string, string>> citizensAndAgreement)
  {
    EvaluationResult result = new();

    foreach (IAlarmModel alarm in alarmModels)
    {
      Evaluation evaluation = new() { AlarmUuid = alarm.UUID };
      if (alarm.CheckOnDate != null)
      {
        DateTime checkOnDate = dateTimeProvider.UnixToDateTime((long)alarm.CheckOnDate);

        DateTime today = dateTimeProvider.EndOfDay(dateTimeProvider.Today());
        if (checkOnDate <= today)
        {
          SignalModel signal = new SignalModel()
          {
            Type = SIGNAL_TYPE_TIMEFRAME,
            IsActive = true,
            OffByAmount = -alarm.Amount,
            CreatedAt = dateTimeProvider.UnixNow(),
            JournalEntryUuids = null,
            AlarmUuid = alarm.UUID,
            CitizenUuid = citizensAndAgreement[alarm.UUID]["citizen"],
            AgreementUuid = citizensAndAgreement[alarm.UUID]["agreement"]
          };
          evaluation.Signals.Add(signal);

          evaluation.NewCheckOnDate = evaluationHelper.DetermineNextCheckOnDate(
            dateTimeProvider.Today().AddDays(-(1 + alarm.DateMargin)),
            alarm);
        }

        result.Evaluations.Add(evaluation);
      }
    }
    return result;
  }
}
