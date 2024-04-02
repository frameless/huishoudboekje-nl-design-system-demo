using Core.Database.Seeding;
using Microsoft.EntityFrameworkCore;

namespace AlarmService.Domain.Contexts.DatabaseSeeders;

public class AlarmTypeSeeder : IDatabaseSeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AlarmType>().HasData(
            new AlarmType() { Name = "Monthly", Id = 1 },
            new AlarmType() { Name = "Weekly", Id = 2 },
            new AlarmType() { Name = "Once", Id = 3 },
            new AlarmType() { Name = "Yearly", Id = 4 });
    }
}
