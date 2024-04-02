using System;
using System.Collections.Generic;
using AlarmService.Domain.Contexts.DatabaseSeeders;
using Core.Database.Seeding;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace AlarmService.Domain.Contexts
{
  public partial class AlarmServiceContext : DbContext
  {
    private readonly IConfiguration _configuration;
    private readonly string _conectionString;

    public AlarmServiceContext()
    {
      //Needed for ef core migration generation
      _conectionString = "Host=localhost;Database=alarmenservice;Port=5432;Username=postgres;Password=postgres";
    }

    public AlarmServiceContext(IConfiguration configuration)
    {
      _configuration = configuration;
      _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public AlarmServiceContext(IConfiguration configuration, DbContextOptions<AlarmServiceContext> options)
      : base(options)
    {
      _configuration = configuration;
      _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
    }

    public virtual DbSet<Alarm> Alarms { get; set; } = null!;

    public virtual DbSet<AlarmType> AlarmTypes { get; set; } = null!;

    public virtual DbSet<Signal> Signals { get; set; } = null!;

    public virtual DbSet<SignalType> SignalTypes { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      if (!optionsBuilder.IsConfigured)
      {
        optionsBuilder.UseNpgsql(_conectionString);
      }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Seed(new AlarmTypeSeeder());
      modelBuilder.Seed(new SignalTypeSeeder());
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
  }
}
