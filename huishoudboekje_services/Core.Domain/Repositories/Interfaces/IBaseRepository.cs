using Core.CommunicationModels;
using Core.Database.DatabaseCommands;

namespace Core.Database.Repositories.Interfaces;

public interface IBaseRepository<T> where T : DatabaseModel
{
    public Task<Y> ExecuteCommand<Y>(IDatabaseCommand<T, Y> command) where Y : notnull;

    public Task<Paged<T>> ExecuteCommand(PagedCommandDecorator<T> command);

    public Task<List<T>> ExecuteCommand(IDatabaseDecoratableCommand<T> command);
}
