using Core.ErrorHandling.Exceptions;
using Microsoft.AspNetCore.Http;
using UserApi.Services.Interfaces;

namespace UserApi.Middleware;

public class BsnValidationMiddleware(RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context, IBsnService bsnService)
    {
      if (!context.Request.Headers.TryGetValue("X-User-Bsn", out var bsn))
      {
        throw new HHBInvalidInputException($"Bsn parameter not provided", "Incorrect request");
      }
      if (!(bsnService.Validate(bsn) && bsnService.IsAllowed(bsn).Result))
      {
        throw new HHBInvalidInputException($"Incorrect Bsn parameter provided", "Incorrect request");
      }
      return next(context);
    }
}
