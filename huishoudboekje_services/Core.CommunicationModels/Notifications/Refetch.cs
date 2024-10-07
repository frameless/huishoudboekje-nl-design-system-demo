namespace Core.CommunicationModels.Notifications;

public enum RefetchType
{
  signalcount
}

public class Refetch
{
  public RefetchType Type { get; set; }
  public Dictionary<string, object>? Variables { get; set; }
}
