using Core.CommunicationModels.Exceptions;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Core.ErrorHandling.ExceptionInterceptors;

public class MassTransitExceptionInterceptor<T>(ILogger<MassTransitExceptionInterceptor<T>> logger, IRequestClient<ExceptionLogMessage> requestClient)
  : IFilter<ConsumeContext<T>> where T : class
{
  public async Task Send(ConsumeContext<T> context, IPipe<ConsumeContext<T>> next)
  {
    try
    {
      await next.Send(context);
    }
    catch (HHBException exception)
    {
      logger.LogError(ExceptionFormatter.DeveloperMessage(exception));

      // rethrow exception to error queue the message
      throw exception;
    }
    catch (Exception exception)
    {
      HHBUnexpectedException unexpectedException = new(exception);
      ExceptionLogResult result = await ExceptionProducer.Send(unexpectedException, requestClient);
      logger.LogError(ExceptionFormatter.UnexpectedMessage(result));

      // rethrow exception to error queue the message
      throw unexpectedException;
    }
  }

  public void Probe(ProbeContext context)
  {
    return;
  }
}
