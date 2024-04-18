using Core.Database.DatabaseCommands;
using Core.Database.Repositories.Interfaces;
using LogService.Database.Contexts;
using Microsoft.EntityFrameworkCore;

namespace LogService.Database.Commands;

public class GetAllUserActivities : IDatabaseDecoratableCommand<UserActivities>
{
    public Task<IQueryable<UserActivities>> Execute(DbSet<UserActivities> set)
    {
        return Task.FromResult(new IncludeCommandDecorator<UserActivities>(
                new WhereCommandDecorator<UserActivities>(
                    new GetAllCommand<UserActivities>(),userActivities => !userActivities.Action.Contains("LogRequest")),
                x => x.Entities).Execute(set).Result);
    }

}
