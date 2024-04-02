using Core.CommunicationModels.Exceptions;
using LogService.Database.Repositories;
using MassTransit;

namespace LogService.MessageQueue.Consumers;

public class ExceptionLogConsumer(IExceptionLogRepository repository) : IConsumer<ExceptionLogMessage>
{
  public async Task Consume(ConsumeContext<ExceptionLogMessage> context)
  {
    ExceptionLogResult result = await repository.Insert(context.Message);
    await context.RespondAsync(result);
  }
}
