using Core.Database.Seeding;
using FileServices.Domain.Contexts.Models;
using Microsoft.EntityFrameworkCore;

namespace FileServices.Domain.Contexts.DatabaseSeeders;

public class FileTypeSeeder : IDatabaseSeeder
{
  public void Seed(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<FileType>().HasData(
      Enum.GetValues(typeof(Core.CommunicationModels.Files.FileType))
        .Cast<Core.CommunicationModels.Files.FileType>()
        .Select(
          e => new FileType()
          {
            Id = (int)e,
            Name = e.ToString()!
          }));
  }
}
