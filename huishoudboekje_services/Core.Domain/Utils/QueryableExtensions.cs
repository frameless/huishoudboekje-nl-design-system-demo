using System.Linq.Expressions;

namespace Core.Database.Utils;

public static class QueryableExtensions
{
    /// <summary>
    /// Used to dynamically sort a TEntity when executing commands.
    /// use as follows: OrderBy(x => x.id, true)
    /// </summary>
    /// <param name="source">query source, automatically gotten by doing query.OrderBy</param>
    /// <param name="keySelector">Func that selects the key to order on (lamba expression)</param>
    /// <param name="descending">bool that states whether to OrderBy desc for true, asc for false</param>
    /// <returns>Queryable object with order</returns>
    public static IOrderedQueryable<TSource> OrderBy<TSource, TKey>(
        this IQueryable<TSource> source,
        Expression<Func<TSource, TKey>> keySelector,
        bool descending)
    {
        return descending ? source.OrderByDescending(keySelector) : source.OrderBy(keySelector);
    }
}
