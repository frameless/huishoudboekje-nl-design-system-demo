using System.Linq.Expressions;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class IncludeCommandDecorator<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    private readonly Expression<Func<T, object>> _expression;
    private readonly IDatabaseDecoratableCommand<T> _command;

    public IncludeCommandDecorator(
        IDatabaseDecoratableCommand<T> databaseCommand,
        Expression<Func<T, object>> includeLambda)
    {
        _expression = includeLambda;
        _command = databaseCommand;
    }

    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(_command.Execute(set).Result.Include(_expression));
    }
}
