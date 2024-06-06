namespace Core.CommunicationModels.AlarmModels;

public class DeleteAlarms
{
  public List<string> Ids { get; set; }
  public bool DeleteSignals { get; set; }
  public List<string> CitizenIds { get; set; }
}
