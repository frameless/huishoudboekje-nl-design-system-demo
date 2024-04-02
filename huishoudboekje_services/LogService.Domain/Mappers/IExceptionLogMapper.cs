using Core.CommunicationModels.Exceptions;
using LogService.Database.Contexts;

namespace LogService.Database.Mappers;

public interface IExceptionLogMapper
{
  public ExceptionsLogs GetDatabaseObject(ExceptionLogMessage communicationModel);

  public ExceptionLogResult GetResult(ExceptionsLogs databaseObject);
}
