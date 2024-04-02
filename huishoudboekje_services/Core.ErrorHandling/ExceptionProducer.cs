using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions;
using MassTransit;

namespace Core.ErrorHandling;

public class ExceptionProducer
{
  public static async Task<ExceptionLogResult> Send(HHBUnexpectedException exception, IRequestClient<ExceptionLogMessage> client)
  {
    ExceptionLogMessage message = new()
    {
      Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
      Message = exception.ErrorMessage,
      Type = exception.ActualException?.GetType().ToString() ?? exception.GetType().ToString(),
      StackTrace = exception.Location
    };
    Response<ExceptionLogResult> response = await client.GetResponse<ExceptionLogResult>(message);
    return response.Message;
  }
}
