namespace Core.CommunicationModels.AlarmModels.Interfaces;

public interface ICheckSaldos
{
  public IList<string> AffectedCitizens { get; }
  public int SaldoThreshold { get; }
}
