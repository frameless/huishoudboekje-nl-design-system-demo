using Core.CommunicationModels.Exceptions;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.Database;
using Core.Grpc;
using Core.MessageQueue;
using LogService.Controllers.Controllers;
using LogService.Controllers.Controllers.UserActivities;
using LogService.Database.Contexts;
using LogService.Database.Repositories;
using LogService.Grpc;
using LogService.MessageQueue.Consumers;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

namespace LogService;

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

        services.AddGrpcService(Configuration, enableAuditLogging: false);
        services.AddMassTransitService(Configuration, AddConsumers);
        services.AddDatabaseContext<LogServiceContext>(Configuration);
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
          scope.ServiceProvider.GetRequiredService<LogServiceContext>().Database.Migrate();
        }

        // Configure GRPC services.
        app.MapGrpcService<UserActivitiesView>();

        app.UseRouting();
        app.UseGrpcMetrics();
        app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client");
        app.MapGrpcHealthChecksService();
    }

    private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
    {
        massTransit.AddConsumer<UserActivityLogConsumer>();
        massTransit.AddConsumer<ExceptionLogConsumer>();
        massTransit.AddRequestClient<ExceptionLogResult>();

        return massTransit;
    }

    private void AddDependencyInjectionServices(IServiceCollection services)
    {
        services.AddScoped<LogServiceContext>();
        services.AddScoped<IUserActivitiesRepository, UserActivitiesRepository>();
        services.AddScoped<IUserActivityController, UserActivitiesController>();
        services.AddScoped<IExceptionLogRepository, ExceptionLogsRepository>();
    }
}
