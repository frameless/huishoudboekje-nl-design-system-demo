using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions.Base;

namespace Core.ErrorHandling;

public class ExceptionFormatter
{
  public static string DeveloperMessage(HHBException exception)
  {
    string exceptionType = exception.ActualException?.GetType().ToString() ?? exception.GetType().ToString();
    return
      $"{DateTime.Now}: Exception of type: {exceptionType}. Message: {exception.ErrorMessage} \nAt: {exception.Location}";
  }

  public static string UnexpectedMessage(ExceptionLogResult exceptionLog)
  {
    return
      $"{DateTimeOffset.FromUnixTimeSeconds(exceptionLog.Timestamp).UtcDateTime}: Exception of type: {exceptionLog.Type}. Message: {exceptionLog.Message} Uuid: {exceptionLog.Uuid}";
  }

  public static string HumanReadable(HHBException exception)
  {
    return exception.ReadableMessage;
  }
}
