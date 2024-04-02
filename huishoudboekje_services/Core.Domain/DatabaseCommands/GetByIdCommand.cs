using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
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
        return await set.FindAsync(this._id) ?? throw new HHBNotFoundException($"{typeof(T)} could not be found by ID: {this._id}.", "One or more requested items could not be found", StatusCode.NotFound);
    }
}
