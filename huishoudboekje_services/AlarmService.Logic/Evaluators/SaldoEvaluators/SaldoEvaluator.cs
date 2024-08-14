using Core.CommunicationModels.SignalModel;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Evaluators.SaldoEvaluators;

public class SaldoEvaluator(IDateTimeProvider dateTimeProvider, int threshold) : BaseEvaluator<KeyValuePair<string, int>>
{
  private const int SignalTypeNegativeSaldo = 4;

  protected override Evaluation? GetEvaluation(KeyValuePair<string, int> evaluationInfo)
  {
    Evaluation evaluation = new();
    if (evaluationInfo.Value < threshold)
    {
      evaluation.Signals =
      [
        new SignalModel()
        {
          AlarmUuid = null,
          CreatedAt = dateTimeProvider.UnixNow(),
          IsActive = true,
          JournalEntryUuids = null,
          OffByAmount = evaluationInfo.Value,
          Type = SignalTypeNegativeSaldo,
          CitizenUuid = evaluationInfo.Key
        }
      ];
    }
    return evaluation;
  }

  protected override string PrintError(KeyValuePair<string, int> evaluationInfo)
  {
    return dateTimeProvider.Now() + " Error evaluating negative saldi, citizen id: " + evaluationInfo.Key;
  }
}
