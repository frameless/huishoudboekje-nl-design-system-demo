using Core.ErrorHandling.ExceptionInterceptors;
using Core.MessageQueue;
using Core.utils.DateTimeProvider;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using NotificationService.GraphQL;
using NotificationService.MessageQueue.Consumers;
using Prometheus;

namespace NotificationService;

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
    services.AddMassTransitService(Configuration, AddConsumers);
    services.AddGraphQLServer()
      // .AddHttpRequestInterceptor<GraphqlHttpExceptionInterceptor>()
      // .AddHttpRequestInterceptor<AuthInterceptor>()
      .AddQueryType<Query>()
      .AddSubscriptionType<Subscription>()
      .AddInMemorySubscriptions();

    AddDependencyInjectionServices(services);
  }

  public void Configure(WebApplication app, IWebHostEnvironment env)
  {
    app.MapGraphQL();
    app.MapGet("/healthcheck", () => "Healthy");
  }

  private IBusRegistrationConfigurator AddConsumers(IBusRegistrationConfigurator massTransit)
  {
    massTransit.AddConsumer<NotificationConsumer>();
    return massTransit;
  }

  private void AddDependencyInjectionServices(IServiceCollection services)
  {
    services.AddScoped<IDateTimeProvider, DateTimeProvider>();
    services.AddScoped<SubscriptionPublisher>();
  }
}
