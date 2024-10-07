using Core.CommunicationModels.Notifications;
using MassTransit;
using NotificationService.GraphQL;

namespace NotificationService.MessageQueue.Consumers;

public class RefetchConsumer(SubscriptionPublisher publisher) : IConsumer<Refetch>
{
  public async Task Consume(ConsumeContext<Refetch> context)
  {
    await publisher.RequestRefetch(context.Message);
  }
}
