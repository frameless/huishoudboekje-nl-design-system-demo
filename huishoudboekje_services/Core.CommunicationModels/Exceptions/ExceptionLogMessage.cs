namespace Core.CommunicationModels.Exceptions;

public class ExceptionLogMessage
{
  public long Timestamp { get; set; }
  public string Type { get; set; } = null!;
  public string Message { get; set; } = null!;
  public string StackTrace { get; set; } = null!;
}
