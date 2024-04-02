using Microsoft.EntityFrameworkCore;

namespace Core.Database.Seeding;

public static class ModelBuilderExtensions
{
    public static void Seed(this ModelBuilder modelBuilder, IDatabaseSeeder seeder)
    {
        seeder.Seed(modelBuilder);
    }
}
