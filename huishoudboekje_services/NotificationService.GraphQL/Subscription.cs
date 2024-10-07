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

  [Subscribe]
  [Topic("Refetch")]
  public ValueTask<Refetch> Refetch([EventMessage] Refetch refetch)
  {
    return ValueTask.FromResult(refetch);
  }
}
