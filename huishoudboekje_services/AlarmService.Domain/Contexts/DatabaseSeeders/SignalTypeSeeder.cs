using Core.Database.Seeding;
using Microsoft.EntityFrameworkCore;

namespace AlarmService.Domain.Contexts.DatabaseSeeders;

public class SignalTypeSeeder : IDatabaseSeeder
{
  public void Seed(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<SignalType>().HasData(
      new SignalType() { Name = "Date", Id = 1 },
      new SignalType() { Name = "Amount", Id = 2 },
      new SignalType() { Name = "MultipleTransactions", Id = 3 },
      new SignalType() { Name = "NegativeSaldo", Id = 4 });
  }
}
