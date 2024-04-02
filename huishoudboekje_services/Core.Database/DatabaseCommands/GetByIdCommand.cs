using Core.Database.Exceptions;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class GetByIdCommand<T> : IDatabaseCommand<T, T> where T : DatabaseModel
{
    private readonly Guid _id;

    public GetByIdCommand(Guid id)
    {
        this._id = id;
    }

    public async Task<T> Execute(DbSet<T> set)
    {
        return await set.FindAsync(this._id) ?? throw new IdNotFoundException();
    }
}
