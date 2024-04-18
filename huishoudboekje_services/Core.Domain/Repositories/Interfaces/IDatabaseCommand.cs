using Microsoft.EntityFrameworkCore;

namespace Core.Database.Repositories.Interfaces;

public interface IDatabaseCommand<T, Y> where T : DatabaseModel
{
    public Task<Y> Execute(DbSet<T> set);
}