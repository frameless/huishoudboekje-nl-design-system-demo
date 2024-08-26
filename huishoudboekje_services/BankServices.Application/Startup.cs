using BankServices.Domain.Contexts;
using BankServices.Domain.Mappers;
using BankServices.Domain.Mappers.Interfaces;
using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Grpc.Controllers;
using BankServices.Grpc.Mappers;
using BankServices.Grpc.Mappers.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices;
using BankServices.Logic.Services.CsmServices.Interfaces;
using BankServices.Logic.Services.PaymentExportServices;
using BankServices.Logic.Services.PaymentExportServices.Interfaces;
using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using BankServices.Logic.Services.TransactionServices;
using BankServices.Logic.Services.TransactionServices.Interfaces;
using BankServices.MessageQueue.Consumers;
using BankServices.MessageQueue.Producers;
using Core.Database;
using Core.Grpc;
using Core.MessageQueue;
using Core.utils.DateTimeProvider;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

namespace BankServices.Application;

public class Startup
{
  private IConfiguration Configuration { get; }

  public Startup(IConfiguration configuration)
  {
    Configuration = configuration;
  }

  public void ConfigureServices(IServiceCollection services)
  {
    services.AddMetricServer(options => { options.Port = (ushort)Configuration.GetValue("HHB_METRICS_PORT", 9000); });
    services.AddGrpcService(Configuration);
    services.AddMassTransitService(Configuration, AddConsumers);
    services.AddDatabaseContext<BankServiceContext>(Configuration);
    services.AddGrpcHealthChecks()

      //We could add checks here if the service can reach the database or rabbitmq etc.
      //We need to be careful with this since this can cause the service to restart unnecessary in k8s when the database is down
      //For now, only a simple check if this service is reachable.
      .AddAsyncCheck("health", async () => await Task.FromResult(HealthCheckResult.Healthy()));
    AddDependencyInjectionServices(services);
  }

  public void Configure(WebApplication app, IWebHostEnvironment env)
  {
    if (app.Environment.IsDevelopment())
    {
      using IServiceScope scope = app.Services.CreateScope();
      scope.ServiceProvider.GetRequiredService<BankServiceContext>().Database.Migrate();
    }

    // Configure GRPC services.
    app.MapGrpcService<CsmController>();
    app.MapGrpcService<PaymentRecordController>();
    app.MapGrpcService<PaymentExportController>();
    app.MapGrpcService<TransactionController>();

    app.UseRouting();
    app.UseGrpcMetrics();
    app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client");
    app.MapGrpcHealthChecksService();
  }

  private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
  {
    massTransit.AddConsumer<UploadedCsmConsumer>();
    massTransit.AddConsumer<GetTransactionsPagedConsumer>();
    massTransit.AddConsumer<GetTransactionsConsumer>();
    massTransit.AddConsumer<UpdateIsReconciledConsumer>();
    massTransit.AddConsumer<CheckPaymentInstructionsConsumer>();
    massTransit.AddConsumer<MatchTransactionToPaymentRecordConsumer>();
    massTransit.AddConsumer<UnMatchTransactionToPaymentRecordConsumer>();
    return massTransit;
  }

  private void AddDependencyInjectionServices(IServiceCollection services)
  {
    services.AddScoped<ICsmService, CsmService>();
    services.AddScoped<ICsmParserService, CsmParserService>();
    services.AddScoped<IFileProducer, FileProducer>();
    services.AddScoped<ICsmRepository, CsmRepository>();
    services.AddScoped<IDateTimeProvider, DateTimeProvider>();
    services.AddScoped<IConfigurationProducer, ConfigurationProducer>();
    services.AddScoped<INotificationProducer, NotificationProducer>();
    services.AddScoped<IJournalEntryProducer, JournalEntryProducer>();
    services.AddScoped<IReconciliationProducer, ReconciliationProducer>();
    services.AddScoped<ISignalProducer, SignalProducer>();
    services.AddScoped<ITransactionService, TransactionService>();
    services.AddScoped<ITransactionRepository, TransactionRepository>();
    services.AddScoped<IPaymentRecordService, PaymentRecordService>();
    services.AddScoped<IPaymentRecordProducer, PaymentRecordHttpProducer>();

    services.AddScoped<IPaymentRecordRepository, PaymentRecordRepository>();
    services.AddScoped<IPaymentExportRepository, PaymentExportRepository>();
    services.AddScoped<IPaymentExportService, PaymentExportService>();
    services.AddScoped<ICreatePaymentInstructionFileProducer, CreatePaymentInstructionFileProducer>();

    services.AddScoped<ICsmGrpcMapper, CsmGrpcMapper>();
    services.AddScoped<ICsmDbMapper, CsmDbMapper>();
    services.AddScoped<ITransactionDbMapper, TransactionDbMapper>();
    services.AddScoped<IPaymentExportDbMapper, PaymentExportDbMapper>();
    services.AddScoped<IPaymentExportGrpcMapper, PaymentExportGrpcMapper>();
    services.AddScoped<ITransactionGrpcMapper, TransactionGrpcMapper>();
  }
}
