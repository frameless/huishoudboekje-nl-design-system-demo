namespace Core.Database.Repositories.Interfaces;

public interface IDatabaseDecoratableCommand<T> : IDatabaseCommand<T, IQueryable<T>> where T : DatabaseModel
{
}