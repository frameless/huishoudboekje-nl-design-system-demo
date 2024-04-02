namespace Core.CommunicationModels.Exceptions;

public class ExceptionLogResult
{
  public Guid Uuid { get; set; }
  public long Timestamp { get; set; }
  public string Type { get; set; } = null!;
  public string Message { get; set; } = null!;
}
