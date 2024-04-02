using Core.CommunicationModels.Exceptions;

namespace LogService.Database.Repositories;

public interface IExceptionLogRepository
{
  public Task<ExceptionLogResult> Insert(ExceptionLogMessage value);
}
