using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Core.ErrorHandling.ExceptionInterceptors;

public class GraphqlHttpExceptionInterceptor : DefaultHttpRequestInterceptor
{
  private ILogger<GraphqlHttpExceptionInterceptor> logger;
  private IRequestClient<ExceptionLogMessage> requestClient;

  public GraphqlHttpExceptionInterceptor(
    ILogger<GraphqlHttpExceptionInterceptor> logger,
    IRequestClient<ExceptionLogMessage> requestClient)
  {
    this.logger = logger;
    this.requestClient = requestClient;
  }

  public override ValueTask OnCreateAsync(
    HttpContext context,
    IRequestExecutor requestExecutor,
    IQueryRequestBuilder requestBuilder,
    CancellationToken cancellationToken)
  {
    try
    {
      return base.OnCreateAsync(
        context,
        requestExecutor,
        requestBuilder,
        cancellationToken);
    }
    catch (HHBException exception)
    {
      logger.LogError(ExceptionFormatter.DeveloperMessage(exception));

      // This exception does not need catching as "throwing" is the response to this gRPC call
      throw new QueryException(new ErrorBuilder().SetMessage(ExceptionFormatter.HumanReadable(exception)).SetCode(
        Enum.GetName(typeof(StatusCode), exception.StatusCode)).Build());
    }
    catch (Exception exception)
    {
      HHBUnexpectedException hhbException = new(exception);
      ExceptionLogResult result = ExceptionProducer.Send(hhbException, requestClient).Result;
      logger.LogError(ExceptionFormatter.UnexpectedMessage(result));

      // This exception does not need catching as "throwing" is the response to this gRPC call
      throw new QueryException(new ErrorBuilder().SetMessage(ExceptionFormatter.HumanReadable(hhbException)).SetCode(
        Enum.GetName(typeof(StatusCode), hhbException.StatusCode)).Build());
    }
  }
}
