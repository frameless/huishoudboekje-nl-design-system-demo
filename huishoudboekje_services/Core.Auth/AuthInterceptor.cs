using Core.utils.Helpers;
using Grpc.Core;
using Grpc.Core.Interceptors;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Core.Auth;

public class AuthInterceptor : Interceptor
{
    private readonly ILogger _logger;
    private readonly IConfiguration _config;
    private readonly AuthFactory _authFactory;

    public AuthInterceptor(ILogger<AuthInterceptor> logger, IConfiguration config)
    {
        this._logger = logger;
        this._config = config;
        this._authFactory = new AuthFactory(config, logger);
    }

    public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(
        TRequest request,
        ServerCallContext context,
        UnaryServerMethod<TRequest, TResponse> continuation)
    {
        if (this._config["HHB_USE_AUTH"] == "0" || typeof(TRequest) == typeof(Grpc.Health.V1.HealthCheckRequest))
        {
            return await continuation(request, context);
        }

        var token = MetadataHelper.GetCookieFromMetadata(context.RequestHeaders, "cookies", "app-token");
        if (token != null)
        {
            IAuthChecker<string> checker = this._authFactory.CreateOrGet(token);
            try
            {
                checker.IsUserAllowedAccess(token);
                return await continuation(request, context);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error thrown by {context.Method}.");
                throw;
            }
        }

        throw new UnauthorizedAccessException("Invalid App Token or no App Token given");
    }
}
