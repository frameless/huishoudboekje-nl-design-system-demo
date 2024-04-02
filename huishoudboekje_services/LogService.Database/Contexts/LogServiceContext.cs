using Core.Database.Exceptions;
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
        _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new NoConnectionStringFound();
    }

    public LogServiceContext(IConfiguration configuration, DbContextOptions<LogServiceContext> options)
        : base(options)
    {
        _configuration = configuration;
        _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new NoConnectionStringFound();
    }

    public virtual DbSet<UserActivities> UserActivities { get; set; }
    public virtual DbSet<UserActivityEntities> UserActivityEntities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_conectionString);
    }
}
