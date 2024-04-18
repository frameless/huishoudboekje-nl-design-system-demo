using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Database.DatabaseCommands;

public class InsertMultipleRecordsCommand<T> : IDatabaseCommand<T, bool> where T : DatabaseModel
{
    private readonly IEnumerable<T> _insertValue;

    public InsertMultipleRecordsCommand(IEnumerable<T> insertValue)
    {
        _insertValue = insertValue;
    }

    public async Task<bool> Execute(DbSet<T> set)
    {
        await set.AddRangeAsync(_insertValue);
        return true;
    }
}
