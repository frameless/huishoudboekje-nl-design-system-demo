using System.Text.Json;
using Core.CommunicationModels.LogModels.Interfaces;
using LogService.Controllers.Controllers.UserActivities;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace LogService.MessageQueue.Consumers;

//name without consumer is name queue in kebab case: class: UserActivityConsumer queue: user-activity-log
public class UserActivityLogConsumer : IConsumer<IUserActivityLog>
{
    private readonly IUserActivityController _controller;
    private readonly ILogger<UserActivityLogConsumer> _logger;

    public UserActivityLogConsumer(
        ILogger<UserActivityLogConsumer> logger,
        IUserActivityController controller)
    {
        _logger = logger;
        _controller = controller;
    }

    public Task Consume(ConsumeContext<IUserActivityLog> context)
    {
        _logger.LogDebug("Consuming message:" + JsonSerializer.Serialize(context.Message));
        return _controller.AddItem(context.Message);
    }
}
