using BankServices.Logic.Producers;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.SignalModel.ConsumerMessages;
using Core.ErrorHandling.Exceptions;
using MassTransit;

namespace BankServices.MessageQueue.Producers;

public class SignalProducer(IRequestClient<IHhbFile> hhbFileRequestClient, IRequestClient<GetFilesMessage> filesRequestClient, IPublishEndpoint publishEndpoint) : ISignalProducer
{
  public Task UpdateJournalEntryUuids(IList<string> uuids)
  {
      RemoveJournalEntryFromSignalMessage message = new()
      {
        JournalEntryIds = uuids
      };
      return publishEndpoint.Publish(message);
  }
}
