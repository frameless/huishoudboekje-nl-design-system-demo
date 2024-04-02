using System.Text.Json.Serialization;
using Core.ErrorHandling.ExceptionInterceptors;
using Core.utils.JsonConverters;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Core.MessageQueue;

public static class AddMassTransitExtension
{
    public static IServiceCollection AddMassTransitService(
        this IServiceCollection services,
        IConfiguration config,
        Func<IBusRegistrationConfigurator, IBusRegistrationConfigurator> addConsumers)
    {
        services.AddMassTransit(
            massTransit =>
            {
                massTransit.SetKebabCaseEndpointNameFormatter();

                massTransit = addConsumers(massTransit);

                //This can be changed to other message brokers other code should not have to be changed when using a different broker
                massTransit.UsingRabbitMq(
                    (context, cfg) =>
                    {
                        cfg.Host(
                            $"rabbitmq://{config["HHB_RABBITMQ_HOST"]}:{config["HHB_RABBITMQ_PORT"]}/",
                            host =>
                            {
                                host.Username(config["HHB_RABBITMQ_USER"]);
                                host.Password(config["HHB_RABBITMQ_PASS"]);
                            });

                        cfg.UseConsumeFilter(typeof(MassTransitExceptionInterceptor<>), context);

                        //Sending messages in python is done using raw json (cant find a other way, yet!).
                        //MassTransit expects an "Envelope" so it cant deserialize the messages that use raw json. (https://masstransit.io/documentation/configuration/serialization)
                        //Therefore the raw json deserializer is added
                        cfg.UseRawJsonDeserializer(isDefault: true);
                        cfg.ConfigureJsonSerializerOptions(options =>
                        {
                          options.PropertyNameCaseInsensitive = true;

                          //options.NumberHandling = JsonNumberHandling.WriteAsString;
                          options.Converters.Add(new NumberToStringJsonConverter());
                          return options;
                        });

                        //if needed should be put in ENV variable
                        //Limits how much it consumes concurrently, it made the temporary logs clearer (Probably not necessary for log service but might be usefull in other cases)
                        //cfg.UseConcurrencyLimit(1);

                        cfg.ConfigureEndpoints(context);
                    });
            });

        return services;
    }
}
