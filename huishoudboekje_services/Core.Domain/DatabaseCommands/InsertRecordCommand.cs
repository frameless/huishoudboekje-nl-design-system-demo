using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Core.Database.DatabaseCommands;

public class InsertRecordCommand<T> : IDatabaseCommand<T, EntityEntry<T>> where T : DatabaseModel
{
    private readonly T _insertValue;

    public InsertRecordCommand(T insertValue)
    {
        this._insertValue = insertValue;
    }

    public async Task<EntityEntry<T>> Execute(DbSet<T> set)
    {
        return await set.AddAsync(this._insertValue);
    }
}