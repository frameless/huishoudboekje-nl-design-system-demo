using Core.Database.Seeding;
using Microsoft.EntityFrameworkCore;

namespace LogService.Database.Contexts.DatabaseSeeders;

public class UserActivityTypeSeeder : IDatabaseSeeder
{
  public void Seed(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<UserActivityType>().HasData(
      new UserActivityType() { Name = "Query", Id = 1 },
      new UserActivityType() { Name = "Mutation", Id = 2 });
  }
}
