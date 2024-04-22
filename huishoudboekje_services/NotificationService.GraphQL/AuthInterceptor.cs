using Core.Auth;
using Core.ErrorHandling.Exceptions;
using Core.utils.Helpers;
using Grpc.Core;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace NotificationService.GraphQL;

public class AuthInterceptor : DefaultHttpRequestInterceptor
{
  private ILogger<AuthInterceptor> _logger;
  private IConfiguration _config;
  private AuthFactory _authFactory;

  public AuthInterceptor(ILogger<AuthInterceptor> logger, IConfiguration config)
  {
    this._logger = logger;
    this._config = config;
    this._authFactory = new AuthFactory(config, logger);
  }


  public override ValueTask OnCreateAsync(
    HttpContext context,
    IRequestExecutor requestExecutor,
    IQueryRequestBuilder requestBuilder,
    CancellationToken cancellationToken)
  {
    if (this._config["HHB_USE_AUTH"] == "0")
    {
      return base.OnCreateAsync(
        context,
        requestExecutor,
        requestBuilder,
        cancellationToken);
    }

    var token = context.Request.Cookies["app-token"];
    if (token != null)
    {
      IAuthChecker<string> checker = this._authFactory.CreateOrGet(token);
      try
      {
        checker.IsUserAllowedAccess(token);
        return base.OnCreateAsync(
          context,
          requestExecutor,
          requestBuilder,
          cancellationToken);
      }
      catch (SecurityTokenException ex)
      {
        throw new HHBAuthorizationException("Invalid App Token or no App Token given", "Unauthorized", ex, StatusCode.Unauthenticated);
      }
    }

    throw new UnauthorizedAccessException("Invalid App Token or no App Token given");
  }
}
