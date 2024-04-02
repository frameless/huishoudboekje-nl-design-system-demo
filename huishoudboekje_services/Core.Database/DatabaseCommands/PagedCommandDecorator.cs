using Core.CommunicationModels;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class PagedCommandDecorator<T> : IDatabaseDecoratableCommand<T> where T : DatabaseModel
{
    private readonly int _skip;
    private readonly int _take;
    private readonly IDatabaseDecoratableCommand<T> _pageableCommand;

    public PagedCommandDecorator(
        IDatabaseDecoratableCommand<T> pageableCommand,
        Pagination pageInfo,
        string orderByParam = "UUID",
        bool isAsc = false)
    {
        _skip = pageInfo.Skip;
        _take = pageInfo.Take;
        _pageableCommand = pageableCommand;
    }

    public async Task<IQueryable<T>> Execute(DbSet<T> set)
    {
        return await Task.FromResult(_pageableCommand.Execute(set).Result.Skip(_skip).Take(_take));
    }

    public async Task<int> GetTotalCount(DbSet<T> set)
    {
        return await Task.FromResult(_pageableCommand.Execute(set).Result.Count());
    }
}
