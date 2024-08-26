using BankServices.Domain.Contexts.Models;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BankServices.Domain.Contexts;

public partial class BankServiceContext : DbContext
{
  private readonly IConfiguration _configuration;
  private readonly string _conectionString;

  public BankServiceContext()
  {
    //Needed for ef core migration generation
    _conectionString = "Host=localhost;Database=banktransactieservice;Port=5432;Username=postgres;Password=postgres";
  }

  public BankServiceContext(IConfiguration configuration)
  {
    _configuration = configuration;
    _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
  }

  public BankServiceContext(IConfiguration configuration, DbContextOptions<BankServiceContext> options)
    : base(options)
  {
    _configuration = configuration;
    _conectionString = _configuration["HHB_DATABASE_URL"] ?? throw new HHBMissingEnvironmentVariableException("HHB_DATABASE_URL was not available", "One or more environment settings are missing. Please contact support", StatusCode.Aborted);
  }

  public virtual DbSet<CustomerStatementMessage> CustomerStatementMessages { get; set; } = null!;
  public virtual DbSet<Transaction> Transactions { get; set; } = null!;
  public virtual DbSet<PaymentRecord> PaymentInstructionLines { get; set; } = null!;
  public virtual DbSet<PaymentExport> PaymentInstructionExports { get; set; } = null!;

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    if (!optionsBuilder.IsConfigured)
    {
      optionsBuilder.UseNpgsql(_conectionString);
    }
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
