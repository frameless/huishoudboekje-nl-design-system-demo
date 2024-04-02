using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class GetAllCommand<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(set);
    }
}