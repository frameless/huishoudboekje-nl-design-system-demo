using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Core.ErrorHandling.ExceptionInterceptors;

public class MinimalRestApiExceptionInterceptor(ILogger<MinimalRestApiExceptionInterceptor> logger, IRequestClient<ExceptionLogMessage> requestClient, RequestDelegate next)
{
  public Task InvokeAsync(HttpContext context)
  {
    try
    {
      return next(context);
    }
    catch (HHBException exception)
    {
      logger.LogError(ExceptionFormatter.DeveloperMessage(exception));
      throw exception;
    }
    catch (Exception exception)
    {
      HHBUnexpectedException hhbException = new(exception);
      ExceptionLogResult result = ExceptionProducer.Send(hhbException, requestClient).Result;
      logger.LogError(ExceptionFormatter.UnexpectedMessage(result));
      throw hhbException;
    }
  }
}
