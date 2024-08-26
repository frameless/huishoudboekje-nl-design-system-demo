using Core.Database;
using Core.Grpc;
using Core.MessageQueue;
using Core.utils.DateTimeProvider;
using FileServices.Domain.Contexts;
using FileServices.Logic.Services.PaymentInstructionServices;
using FileServices.Domain.Repositories;
using FileServices.Logic.Producers;
using FileServices.Logic.Services;
using FileServices.MessageQueue.Consumers;
using FileServices.MessageQueue.Producers;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

namespace FileServices.Application;

public class Startup(IConfiguration configuration)
{
  private IConfiguration Configuration { get; } = configuration;

  public void ConfigureServices(IServiceCollection services)
  {
    services.AddMetricServer(options => { options.Port = (ushort)Configuration.GetValue("HHB_METRICS_PORT", 9000); });

    services.AddGrpcService(Configuration);
    services.AddMassTransitService(Configuration, AddConsumers);
    services.AddDatabaseContext<FileServiceContext>(Configuration);
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
      scope.ServiceProvider.GetRequiredService<FileServiceContext>().Database.Migrate();
    }

    app.UseRouting();
    app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client");
    app.MapGrpcHealthChecksService();
  }

  private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
  {
    massTransit.AddConsumer<CreatePaymentExportConsumer>();
    massTransit.AddConsumer<GetFilesMessageConsumer>();
    massTransit.AddConsumer<HhbFileConsumer>();
    massTransit.AddConsumer<DeleteFileConsumer>();
    return massTransit;
  }

  private void AddDependencyInjectionServices(IServiceCollection services)
  {
    services.AddScoped<FileServiceContext>();
    services.AddScoped<IDateTimeProvider, DateTimeProvider>();
    services.AddScoped<IHhbFileService, HhbFileService>();
    services.AddScoped<IFilesRepository, FilesRepository>();
    services.AddScoped<INotifyProducer, NotifyProducer>();
    services.AddScoped<IPaymentInstructionsService, PaymentInstructionsService>();
  }
}
