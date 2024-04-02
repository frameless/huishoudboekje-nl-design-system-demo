using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Core.Database.DatabaseCommands;

public class UpdateRecordCommand<T> : IDatabaseCommand<T, EntityEntry<T>> where T : DatabaseModel
{
    private readonly T _updateValue;

    public UpdateRecordCommand(T updateValue)
    {
        this._updateValue = updateValue;
    }

    public Task<EntityEntry<T>> Execute(DbSet<T> set)
    {
        return Task.FromResult(set.Update(_updateValue));
    }
}
