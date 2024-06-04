using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.AlarmEvaluation.Saldo;

public class SaldoEvaluator(IDateTimeProvider dateTimeProvider)
{
  public int SIGNAL_TYPE_NEGATIVE_SALDO = 4;

  public EvaluationResult Evaluate(IDictionary<string, int> citizenSaldo, int threshhold)
  {
    EvaluationResult result = new EvaluationResult();
    foreach (var entry in citizenSaldo)
    {
      Evaluation evaluation = new Evaluation();
      if (entry.Value < threshhold)
      {
        evaluation.Signals = new List<ISignalModel>
        {
          new SignalModel()
          {
            AlarmUuid = null,
            CreatedAt = dateTimeProvider.UnixNow(),
            IsActive = true,
            JournalEntryUuids = null,
            OffByAmount = entry.Value,
            Type = SIGNAL_TYPE_NEGATIVE_SALDO,
            CitizenUuid = entry.Key
          }
        };
      }
      result.Evaluations.Add(evaluation);
    }

    return result;
  }
}
