using System.Text.Json;
using Core.CommunicationModels.LogModels;
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
        IUserActivityLog log = CorrectNoneToNull(context.Message);
        return _controller.AddItem(log);
    }

    // This comes from python where None is translated not to NULL but "None". Didn't want to put this in the logic because
    // it only happens here due to python
    private IUserActivityLog CorrectNoneToNull(IUserActivityLog userActivityLog)
    {
      if (userActivityLog.SnapshotAfter == "None")
        userActivityLog.SnapshotAfter = null;
      if (userActivityLog.SnapshotBefore == "None")
        userActivityLog.SnapshotBefore = null;

      return userActivityLog;
    }
}
