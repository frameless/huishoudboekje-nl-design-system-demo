using Core.CommunicationModels.Notifications;

namespace Core.MessageQueue.CommonProducers;

public interface IRefetchProducer
{
  public Task PublishRefetchRequest(Refetch request);
}
