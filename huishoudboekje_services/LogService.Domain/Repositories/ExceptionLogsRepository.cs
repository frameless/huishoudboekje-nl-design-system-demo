using Core.CommunicationModels.Exceptions;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using LogService.Database.Contexts;
using LogService.Database.Mappers;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace LogService.Database.Repositories;

public class ExceptionLogsRepository(LogServiceContext dbContext)
  : BaseRepository<ExceptionsLogs>(dbContext), IExceptionLogRepository
{
  private readonly ExceptionLogMapper mapper = new();

  public async Task<ExceptionLogResult> Insert(ExceptionLogMessage value)
  {
    EntityEntry<ExceptionsLogs> result = await ExecuteCommand(new InsertRecordCommand<ExceptionsLogs>(mapper.GetDatabaseObject(value)));
    await SaveChangesAsync();
    return mapper.GetResult(result.Entity);
  }
}
