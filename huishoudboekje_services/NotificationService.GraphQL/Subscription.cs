using Core.CommunicationModels.Notifications;
using HotChocolate.Subscriptions;

namespace NotificationService.GraphQL;

public class Subscription
{
  [Subscribe]
  [Topic("Notification")]
  public ValueTask<Notification> Notification([EventMessage] Notification notification)
  {
    return ValueTask.FromResult(notification);
  }
}
