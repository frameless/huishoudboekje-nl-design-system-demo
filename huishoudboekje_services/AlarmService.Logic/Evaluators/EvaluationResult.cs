using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Evaluators;

public class EvaluationResult
{
  public IList<Evaluation> Evaluations = new List<Evaluation>();
}

public class Evaluation
{
  public Evaluation()
  {
    Signals = [];
  }

  public IList<SignalResult> Signals { get; set; }
  public long? NewCheckOnDate { get; set; }
  public AlarmModel? Alarm { get; set; }
}
