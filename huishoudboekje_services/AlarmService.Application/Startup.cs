using AlarmService.Domain.Contexts;
using AlarmService.Domain.Repositories;
using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Grpc.Views;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.SignalServices;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using AlarmService.MessageQueue.Consumers;
using AlarmService.MessageQueue.Producers;
using Core.Database;
using Core.Grpc;
using Core.MessageQueue;
using Core.utils.DateTimeProvider;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

namespace AlarmService;

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
    services.AddLogging(configure => configure.AddConsole());
    services.AddGrpcService(Configuration);
    services.AddMassTransitService(Configuration, AddConsumers);
    services.AddDatabaseContext<AlarmServiceContext>(Configuration);
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
      scope.ServiceProvider.GetRequiredService<AlarmServiceContext>().Database.Migrate();
    }

    // Configure GRPC services.
    app.MapGrpcService<AlarmView>();
    app.MapGrpcService<SignalView>();

    app.UseRouting();
    app.UseGrpcMetrics();
    app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client");
    app.MapGrpcHealthChecksService();
  }

  private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
  {
    massTransit.AddConsumer<CheckAlarmsReconiledConsumer>();
    massTransit.AddConsumer<CheckAlarmsTimedConsumer>();
    massTransit.AddConsumer<RemoveJournalEntryFromSignalsConsumer>();
    massTransit.AddConsumer<CheckSaldosConsumer>();
    massTransit.AddConsumer<UpdateEndDateAlarmConsumer>();
    massTransit.AddConsumer<DeleteAlarmsConsumer>();
    massTransit.AddConsumer<UpdateAlarmAmountConsumer>();
    return massTransit;
  }

  private void AddDependencyInjectionServices(IServiceCollection services)
  {
    services.AddScoped<AlarmServiceContext>();
    services.AddScoped<IDateTimeProvider, DateTimeProvider>();
    services.AddScoped<EvaluationHelper>();
    services.AddScoped<CheckOnDateHelper>();
    services.AddScoped<IAlarmService, Logic.Services.AlarmServices.AlarmService>();
    services.AddScoped<ISignalService, SignalService>();
    services.AddScoped<IAlarmRepository, AlarmRepository>();
    services.AddScoped<ICheckAlarmProducer, CheckAlarmHttpProducer>();
    services.AddScoped<IEvaluatorService, EvaluatorService>();
    services.AddScoped<ISignalRepository, SignalRepository>();
    services.AddScoped<IEvaluationResultService, EvaluationResultService>();
  }
}
