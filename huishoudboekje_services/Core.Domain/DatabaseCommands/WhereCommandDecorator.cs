using System.Reflection;
using Core.CommunicationModels;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Core.Database.Utils;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class WhereCommandDecorator<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    private readonly Expression<Func<T, bool>> expression;
    private readonly IDatabaseDecoratableCommand<T> command;

    public WhereCommandDecorator(
        IDatabaseDecoratableCommand<T> databaseCommand,
        Expression<Func<T, bool>> filterLambda)
    {
        this.command = databaseCommand;
        this.expression = filterLambda;
    }

    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(this.command.Execute(set).Result.Where(this.expression));
    }
}
