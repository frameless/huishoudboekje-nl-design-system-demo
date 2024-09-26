using Core.Database.Seeding;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using LogService.Database.Contexts.DatabaseSeeders;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LogService.Database.Contexts;

public class LogServiceContext : DbContext
{
    private readonly IConfiguration _configuration;
    private readonly string _conectionString;

    public LogServiceContext()
    {
        //Needed for ef core migration generation
        _conectionString = "Host=db;Database=logservice;Port=5432;Username=postgres;Password=postgres";
    }

    public LogServiceContext(IConfiguration configuration)
    {
        _configuration = configuration;
        _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public LogServiceContext(IConfiguration configuration, DbContextOptions<LogServiceContext> options)
        : base(options)
    {
        _configuration = configuration;
        _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public virtual DbSet<UserActivities> UserActivities { get; set; }
    public virtual DbSet<UserActivityEntities> UserActivityEntities { get; set; }
    public virtual DbSet<ExceptionsLogs> ExceptionsLogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_conectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      modelBuilder.Seed(new UserActivityTypeSeeder());
    }
}
