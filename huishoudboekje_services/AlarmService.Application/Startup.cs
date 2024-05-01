using AlarmService.Domain.Contexts;
using AlarmService.Domain.Repositories;
using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Grpc.Views;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.Controllers.Alarm;
using AlarmService.Logic.Controllers.Evaluation;
using AlarmService.Logic.Controllers.Signal;
using AlarmService.Logic.EditAlarmService;
using AlarmService.Logic.EditAlarmService.Interface;
using AlarmService.Logic.EditSignalService;
using AlarmService.Logic.EditSignalService.Interface;
using AlarmService.Logic.Misc;
using AlarmService.MessageQueue.Consumers;
using AlarmService.MessageQueue.Producers;
using Core.CommunicationModels.AlarmModels;
using Core.Database;
using Core.ErrorHandling.ExceptionInterceptors;
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
    return massTransit;
  }

  private void AddDependencyInjectionServices(IServiceCollection services)
  {
    services.AddScoped<AlarmServiceContext>();
    services.AddScoped<IDateTimeProvider, DateTimeProvider>();
    services.AddScoped<EvaluationHelper>();
    services.AddScoped<IAlarmController, AlarmController>();
    services.AddScoped<ISignalController, SignalController>();
    services.AddScoped<IAlarmRepository, AlarmRepository>();
    services.AddScoped<ICheckAlarmProducer, CheckAlarmHttpProducer>();
    services.AddScoped<IEvaluationController, EvaluationController>();
    services.AddScoped<ISignalRepository, SignalRepository>();
    services.AddScoped<IEditSignalService, EditSignalService>();
    services.AddScoped<IEditAlarmService, EditAlarmService>();
  }
}
