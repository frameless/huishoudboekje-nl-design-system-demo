using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Producers;

public interface ISignalProducer
{
  public Task UpdateJournalEntryUuids(IList<string> uuids);
}
