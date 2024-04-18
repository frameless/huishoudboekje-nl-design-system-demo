using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;
using Grpc.Core.Interceptors;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Core.ErrorHandling.ExceptionInterceptors;

public class GrpcExceptionInterceptor(ILogger<GrpcExceptionInterceptor> logger, IRequestClient<ExceptionLogMessage> requestClient) : Interceptor
{
  public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(
    TRequest request,
    ServerCallContext context,
    UnaryServerMethod<TRequest, TResponse> continuation)
  {
    try
    {
      return await continuation(request, context);
    }
    catch (HHBException exception)
    {
      logger.LogError(ExceptionFormatter.DeveloperMessage(exception));
      var status = new Status(exception.StatusCode, ExceptionFormatter.HumanReadable(exception));

      // This exception does not need catching as "throwing" is the response to this gRPC call
      throw new RpcException(status);
    }
    catch (Exception exception)
    {
      HHBUnexpectedException hhbException = new(exception);
      ExceptionLogResult result = await ExceptionProducer.Send(hhbException, requestClient);
      logger.LogError(ExceptionFormatter.UnexpectedMessage(result));
      var status = new Status(hhbException.StatusCode, ExceptionFormatter.HumanReadable(hhbException));

      // This exception does not need catching as "throwing" is the response to this gRPC call
      throw new RpcException(status);
    }
  }
}
