using Microsoft.AspNetCore.Diagnostics;

namespace UserApi.Web;

public class CustomExceptionHandler(ILogger<CustomExceptionHandler> logger) : IExceptionHandler
{
  public ValueTask<bool> TryHandleAsync(
    HttpContext httpContext,
    Exception exception,
    CancellationToken cancellationToken)
  {
    var exceptionMessage = exception.Message;
    logger.LogError(
      "Error Message: {exceptionMessage},Time of occurrence {time}",
      exceptionMessage,
      DateTime.UtcNow);
    httpContext.Response.StatusCode = 404;
    return ValueTask.FromResult(true);
  }
}
