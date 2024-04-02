using System.Linq.Expressions;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class GetMultipleByIdCommand<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    private readonly Expression<Func<T, bool>> _where;

    public GetMultipleByIdCommand(Expression<Func<T, bool>> where)
    {
        this._where = where;
    }

    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(set.Where(this._where));
    }
}