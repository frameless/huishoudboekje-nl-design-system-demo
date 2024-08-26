using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Evaluators;

public class SignalResult
{
  public ISignalModel Signal { get; set; }

  public bool UpdateExisting = false;
}
