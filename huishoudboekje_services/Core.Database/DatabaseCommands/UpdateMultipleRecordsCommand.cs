using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class UpdateMultipleRecordsCommand<T> : IDatabaseCommand<T, bool> where T : DatabaseModel
{
    private readonly IEnumerable<T> _insertValue;

    public UpdateMultipleRecordsCommand(IEnumerable<T> insertValue)
    {
        _insertValue = insertValue;
    }

    public Task<bool> Execute(DbSet<T> set)
    {
        set.UpdateRange(_insertValue);
        return Task.FromResult(true);
    }
}
