using Core.CommunicationModels.Notifications;
using MassTransit;
using NotificationService.GraphQL;

namespace NotificationService.MessageQueue.Consumers;

public class NotificationConsumer(SubscriptionPublisher publisher) : IConsumer<Notification>
{
  public async Task Consume(ConsumeContext<Notification> context)
  {
    await publisher.Notify(context.Message);
  }
}
