using Microsoft.AspNetCore.Diagnostics;

namespace UserApi.Web;

public class CustomExceptionHandler(ILogger<CustomExceptionHandler> logger) : IExceptionHandler
{
  public ValueTask<bool> TryHandleAsync(
    HttpContext httpContext,
    Exception exception,
    CancellationToken cancellationToken)
  {
    //No need to log exception because the exception middleware does that already.
    httpContext.Response.StatusCode = 404;
    return ValueTask.FromResult(true);
  }
}
