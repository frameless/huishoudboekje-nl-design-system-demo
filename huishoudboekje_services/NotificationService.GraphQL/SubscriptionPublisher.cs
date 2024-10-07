using Core.CommunicationModels.Notifications;
using HotChocolate.Subscriptions;

namespace NotificationService.GraphQL;

public class SubscriptionPublisher([Service] ITopicEventSender sender)
{
  public async Task Notify(Notification message)
  {
    await sender.SendAsync("Notification", message);
  }

  public async Task RequestRefetch(Refetch message)
  {
    await sender.SendAsync("Refetch", message);
  }
}
