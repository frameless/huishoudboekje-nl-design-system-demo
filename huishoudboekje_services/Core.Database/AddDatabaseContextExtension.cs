using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Database;

public static class AddDatabaseContextExtension
{
    public static IServiceCollection AddDatabaseContext<T>(this IServiceCollection services, IConfiguration config)
        where T : DbContext
    {
        services.AddDbContext<T>(
            options =>
                options.UseNpgsql(config["HHB_DATABASE_URL"]));

        return services;
    }
}
