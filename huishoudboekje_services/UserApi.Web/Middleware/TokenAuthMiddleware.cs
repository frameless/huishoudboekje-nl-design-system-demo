using Core.ErrorHandling.Exceptions;
using UserApi.Services.AuthServices.Interfaces;

namespace UserApi.Web.Middleware;

public class TokenAuthMiddleware(IConfiguration configuration, RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context, IAuthService authService)
  {
    if (context.Request.Path.Equals("/healthz") || context.Request.Path.Equals(configuration["HHB_URL_PREFIX"] + "/auth/token"))
    {
      return next(context);
    }
    if (configuration["HHB_USE_AUTH"] == "0")
    {
      return next(context);
    }
    if (!context.Request.Headers.TryGetValue("X-Api-Token", out var apiToken))
    {
      throw new HHBInvalidInputException($"No api token provided", "Incorrect request");
    }
    if (!authService.ValidateToken(apiToken, context.Connection.RemoteIpAddress?.ToString()).Result)
    {
      throw new HHBInvalidInputException($"Incorrect token provided", "Incorrect request");
    }
    return next(context);
  }
}
