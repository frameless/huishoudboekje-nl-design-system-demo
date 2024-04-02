using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.AlarmEvaluation.Saldo;

public class SaldoEvaluator()
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
            CreatedAt = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds(),
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
