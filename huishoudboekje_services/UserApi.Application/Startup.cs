using Core.MessageQueue;
using MassTransit;
using Prometheus;
using UserApi.Producers;
using UserApi.Producers.Interfaces;
using UserApi.Services;
using UserApi.Services.Interfaces;
using UserApi.Web;

namespace UserService.Application;

public class Startup(IConfiguration configuration)
{
    private IConfiguration Configuration { get; } = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMetricServer(options => { options.Port = (ushort)Configuration.GetValue("HHB_METRICS_PORT", 9000); });
      services.AddMassTransitService(Configuration, AddConsumers);
      services.AddUserApi(Configuration);
      services.AddHealthChecks();
      AddDependencyInjectionServices(services);
    }

    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
      app.UseMetricServer();
      app.UseHttpMetrics();
      app.MapHealthChecks("/healthz");
      app.AddUserApi(env);
    }
    private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
    {
      return massTransit;
    }

    private void AddDependencyInjectionServices(IServiceCollection services)
    {
      services.AddScoped<IBsnService, BsnService>();
      services.AddScoped<ICheckBsnProducer, CheckBsnHttpProducer>();
      services.AddScoped<IMonthlyReportProducer, MonthlyReportHttpProducer>();
      services.AddScoped<IMinimalCitizenDataProducer, MinimalCitizenDataHttpProducer>();
    }
}
