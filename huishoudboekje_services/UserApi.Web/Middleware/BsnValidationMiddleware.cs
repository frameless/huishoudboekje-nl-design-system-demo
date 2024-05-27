using Core.ErrorHandling.Exceptions;
using UserApi.Services.BsnServices.interfaces;
using UserApi.Services.Interfaces;

namespace UserApi.Web.Middleware;

public class BsnValidationMiddleware(IConfiguration configuration, RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context, IBsnService bsnService)
    {
      if (context.Request.Path.Equals("/healthz") || context.Request.Path.Equals(configuration["HHB_URL_PREFIX"] + "/auth/token"))
      {
        return next(context);
      }
      if (!context.Request.Headers.TryGetValue("X-User-Bsn", out var bsn))
      {
        throw new HHBInvalidInputException($"Bsn parameter not provided", "Incorrect request");
      }
      if (!(bsnService.Validate(bsn).Result && bsnService.IsAllowed(bsn).Result))
      {
        throw new HHBInvalidInputException($"Incorrect Bsn parameter provided", "Incorrect request");
      }
      return next(context);
    }
}
