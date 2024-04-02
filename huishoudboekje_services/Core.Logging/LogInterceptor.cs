using Grpc.Core;
using Grpc.Core.Interceptors;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Core.Logging;

public class LogInterceptor : Interceptor
{
  private readonly AuditLogger _auditLogger;

  public LogInterceptor(ILogger<LogInterceptor> logger, IPublishEndpoint publishEndpoint, IConfiguration config)
  {
    this._auditLogger = new AuditLogger(logger, publishEndpoint, config);
  }

  public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(
    TRequest request,
    ServerCallContext context,
    UnaryServerMethod<TRequest, TResponse> continuation)
  {
    if (typeof(TRequest) == typeof(Grpc.Health.V1.HealthCheckRequest))
    {
      return await continuation(request, context);
    }
    TResponse continuationResult = await continuation(request, context);
    await _auditLogger.LogRequest(context, request, continuationResult);
    return continuationResult;
  }
}
