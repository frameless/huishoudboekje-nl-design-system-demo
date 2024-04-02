using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.AlarmEvaluation;

public class EvaluationResult
{
  public IList<Evaluation> Evaluations = new List<Evaluation>();
}

public class Evaluation
{
  public IList<ISignalModel> Signals { get; set; } = new List<ISignalModel>();
  public long? NewCheckOnDate { get; set; }
  public string AlarmUuid { get; set; }
}
