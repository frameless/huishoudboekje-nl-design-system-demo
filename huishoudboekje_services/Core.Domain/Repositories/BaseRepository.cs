using Core.CommunicationModels;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Core.Database.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : DatabaseModel
{
    private readonly DbContext _dbContext;

    protected BaseRepository(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected async Task<IDbContextTransaction> BeginTransaction()
    {
      return await _dbContext.Database.BeginTransactionAsync();
    }
    protected async Task SaveChangesAsync()
    {
      await _dbContext.SaveChangesAsync();
    }

    public async Task<Y> ExecuteCommand<Y>(IDatabaseCommand<T, Y> command) where Y : notnull
    {
      var result = await command.Execute(_dbContext.Set<T>());
      return result;
    }

    public async Task<List<T>> ExecuteCommand(IDatabaseDecoratableCommand<T> command)
    {
      List<T> result = await command.Execute(_dbContext.Set<T>()).Result.ToListAsync();
      return result;
    }

    public async Task<Paged<T>> ExecuteCommand(PagedCommandDecorator<T> command)
    {
      IQueryable<T> result = await command.Execute(_dbContext.Set<T>());
      var totalCount = await command.GetTotalCount(_dbContext.Set<T>());
      List<T> data = await result.ToListAsync();
      return new Paged<T>(data, totalCount);
    }
}
