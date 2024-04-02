using Core.Auth;
using Core.ErrorHandling.ExceptionInterceptors;
using Core.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Grpc;

public static class AddGrpcExtension
{
    public static IServiceCollection AddGrpcService(this IServiceCollection services, IConfiguration config, bool enableAuditLogging = true)
    {
        services.AddGrpc(
          options =>
          {
            options.Interceptors.Add<GrpcExceptionInterceptor>();
            options.Interceptors.Add<AuthInterceptor>();
            if (enableAuditLogging)
            {
              options.Interceptors.Add<LogInterceptor>();
            }
          });

        services.AddSingleton<AuthInterceptor>();

        return services;
    }
}
