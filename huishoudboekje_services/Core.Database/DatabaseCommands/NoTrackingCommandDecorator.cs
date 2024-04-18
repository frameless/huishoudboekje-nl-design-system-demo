using Core.CommunicationModels;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class NoTrackingCommandDecorator<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
  private readonly IDatabaseDecoratableCommand<T> _decoratable;

  public NoTrackingCommandDecorator(IDatabaseDecoratableCommand<T> decoratable)
  {
    _decoratable = decoratable;
  }

  public async Task<IQueryable<T>> Execute(DbSet<T> set)
  {
    return await Task.FromResult(_decoratable.Execute(set).Result.AsNoTracking());
  }
}
