using BankServices.Logic.Producers;
using Core.CommunicationModels.Notifications;
using MassTransit;

namespace BankServices.MessageQueue.Producers;

public class NotificationProducer(IPublishEndpoint publishEndpoint) : INotificationProducer
{
  public Task Notify(Notification message)
  {
    return publishEndpoint.Publish(message);
  }
}
