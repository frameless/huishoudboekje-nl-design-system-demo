using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class DeleteRecordDecorator<T> : IDatabaseCommand<T, bool> where T : DatabaseModel
{
  private IDatabaseDecoratableCommand<T> decoratableCommand;

  public DeleteRecordDecorator(IDatabaseDecoratableCommand<T> databaseCommand)
  {
    decoratableCommand = databaseCommand;
  }

  public async Task<bool> Execute(DbSet<T> set)
  {
    await decoratableCommand.Execute(set).Result.ExecuteDeleteAsync();
    return true;
  }
}
