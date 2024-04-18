using Microsoft.EntityFrameworkCore;

namespace Core.Database.Seeding;

public interface IDatabaseSeeder
{
    public void Seed(ModelBuilder modelBuilder);
}
