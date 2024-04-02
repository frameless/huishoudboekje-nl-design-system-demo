using Core.ErrorHandling.Exceptions;
using Microsoft.AspNetCore.Http;

namespace UserApi.Middleware;

public class SamlAuthMiddleware(RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context)
  {
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
