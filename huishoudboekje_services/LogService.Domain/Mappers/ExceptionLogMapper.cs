using Core.CommunicationModels.Exceptions;
using LogService.Database.Contexts;

namespace LogService.Database.Mappers;

public class ExceptionLogMapper : IExceptionLogMapper
{
  public ExceptionsLogs GetDatabaseObject(ExceptionLogMessage communicationModel)
  {
    return new ExceptionsLogs()
    {
      Message = communicationModel.Message,
      Timestamp = communicationModel.Timestamp,
      Type = communicationModel.Type,
      StackTrace = communicationModel.StackTrace
    };
  }

  public ExceptionLogResult GetResult(ExceptionsLogs databaseObject)
  {
    return new ExceptionLogResult()
    {
      Uuid = databaseObject.Uuid,
      Message = databaseObject.Message,
      Timestamp = databaseObject.Timestamp,
      Type = databaseObject.Type,
    };
  }
}
