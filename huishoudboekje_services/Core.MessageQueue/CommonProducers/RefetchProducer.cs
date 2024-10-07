using Core.CommunicationModels.Notifications;
using MassTransit;

namespace Core.MessageQueue.CommonProducers;

public class RefetchProducer(IPublishEndpoint publishEndpoint) : IRefetchProducer
{
  public async Task PublishRefetchRequest(Refetch request)
  {
    await publishEndpoint.Publish(request);
  }
}
