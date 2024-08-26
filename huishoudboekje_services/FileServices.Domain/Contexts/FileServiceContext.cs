using Core.Database.Seeding;
using Core.ErrorHandling.Exceptions;
using FileServices.Domain.Contexts.DatabaseSeeders;
using FileServices.Domain.Contexts.Models;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using File = FileServices.Domain.Contexts.Models.File;

namespace FileServices.Domain.Contexts
{
  public partial class FileServiceContext : DbContext
  {
    private readonly IConfiguration _configuration;
    private readonly string _conectionString;

    public FileServiceContext()
    {
      //Needed for ef core migration generation
      _conectionString = "Host=localhost;Database=fileservice;Port=5432;Username=postgres;Password=postgres";
    }

    public FileServiceContext(IConfiguration configuration)
    {
      _configuration = configuration;
      _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public FileServiceContext(IConfiguration configuration, DbContextOptions<FileServiceContext> options)
      : base(options)
    {
      _configuration = configuration;
      _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public virtual DbSet<File> Files { get; set; } = null!;

    public virtual DbSet<FileType> FileTypes { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      if (!optionsBuilder.IsConfigured)
      {
        optionsBuilder.UseNpgsql(_conectionString);
      }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Seed(new FileTypeSeeder());
    }
  }
}
