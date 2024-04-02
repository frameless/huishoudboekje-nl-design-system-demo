using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class DeleteRecordCommand<T> : IDatabaseCommand<T, bool> where T : DatabaseModel
{
  private readonly T _updateValue;

  public DeleteRecordCommand(T value)
  {
    _updateValue = value;
  }

  public Task<bool> Execute(DbSet<T> set)
  {
    set.Remove(_updateValue);
    return Task.FromResult(true);
  }
}
