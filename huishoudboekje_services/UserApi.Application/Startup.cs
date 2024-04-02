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
      services.AddUserApi(Configuration);
      AddDependencyInjectionServices(services);
    }

    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
      app.AddUserApi(env);
    }

    private void AddDependencyInjectionServices(IServiceCollection services)
    {
      services.AddScoped<IBsnService, BsnService>();
      services.AddScoped<ICheckBsnProducer, CheckBsnHttpProducer>();
      services.AddScoped<IMonthlyReportProducer, MonthlyReportHttpProducer>();
      services.AddScoped<IMinimalCitizenDataProducer, MinimalCitizenDataHttpProducer>();
    }
}
