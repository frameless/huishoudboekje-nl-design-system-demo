using Core.MessageQueue;
using MassTransit;
using Prometheus;
using UserApi.Domain.clients;
using UserApi.Domain.clients.interfaces;
using UserApi.Domain.repositories;
using UserApi.Domain.repositories.interfaces;
using UserApi.Producers;
using UserApi.Producers.Interfaces;
using UserApi.Services.AuthServices;
using UserApi.Services.AuthServices.Interfaces;
using UserApi.Services.BsnServices;
using UserApi.Services.BsnServices.interfaces;
using UserApi.Web;

namespace UserApi.Application;

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
      services.AddScoped<IAuthService, AuthService>();
      services.AddScoped<IKeyValueClient, RedisClient>();
      services.AddScoped<ITokenRepository, TokenRepository>();
      services.AddScoped<ISecretGenerator, SecretGenerator>();
    }
}
