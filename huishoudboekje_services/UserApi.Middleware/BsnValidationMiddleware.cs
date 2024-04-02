using Microsoft.AspNetCore.Http;
using UserApi.Services.Interfaces;

namespace UserApi.Middleware;

public class BsnValidationMiddleware(RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context, IBsnService bsnService)
    {
      if (!context.Request.Headers.TryGetValue("X-User-Bsn", out var bsn))
      {
        throw new Exception("Bsn parameter not provided");
      }
      if (!(bsnService.Validate(bsn) && bsnService.IsAllowed(bsn).Result))
      {
        throw new Exception("Incorrect Bsn parameter provided");
      }
      return next(context);
    }
}
