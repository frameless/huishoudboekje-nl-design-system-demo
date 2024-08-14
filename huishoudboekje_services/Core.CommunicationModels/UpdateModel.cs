namespace Core.CommunicationModels;

public class UpdateModel
{
  public string Uuid { get; set; }

  public Dictionary<string, object?> Updates { get; set; }
}
