using Core.ErrorHandling.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace UserApi.Middleware;

public class SamlAuthMiddleware(IConfiguration configuration, RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context)
  {
    if (context.Request.Path.Equals("/healthz"))
    {
      return next(context);
    }
    if (configuration["HHB_USE_AUTH"] == "0")
    {
      return next(context);
    }
    if (!context.Request.Headers.TryGetValue("X-Saml-Token", out var samlToken))
    {
      throw new HHBInvalidInputException($"No Saml token provided", "Incorrect request");
    }
    //TODO check if valid saml token
    //TODO check if i can use core.auth + SamlKeyChecker
    //TODO check if given bsn matches bsn in token maybe
    return next(context);
  }
}
