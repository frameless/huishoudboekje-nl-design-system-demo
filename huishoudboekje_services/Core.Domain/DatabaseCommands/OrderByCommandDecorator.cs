using System.Linq.Expressions;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Core.Database.Utils;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class OrderByCommandDecorator<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    private Expression<Func<T, object>> _expression;
    private bool _desc;
    private IDatabaseDecoratableCommand<T> _command;

    public OrderByCommandDecorator(
        IDatabaseDecoratableCommand<T> databaseCommand,
        Expression<Func<T, object>> orderLambda,
        bool desc = false)
    {
        this._expression = orderLambda;
        this._desc = desc;
        this._command = databaseCommand;
    }

    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(this._command.Execute(set).Result.OrderBy(this._expression, this._desc));
    }
}
