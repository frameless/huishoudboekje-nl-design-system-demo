using Core.CommunicationModels.Notifications;

namespace BankServices.Logic.Producers;

public interface INotificationProducer
{
  Task Notify(Notification message);
}
