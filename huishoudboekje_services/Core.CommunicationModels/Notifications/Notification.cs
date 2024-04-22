namespace Core.CommunicationModels.Notifications;

public class Notification
{
  public string Message { get; set; }
  public Dictionary<string, string>? AdditionalProperties { get; set; }
  public string? Title { get; set; }
}
