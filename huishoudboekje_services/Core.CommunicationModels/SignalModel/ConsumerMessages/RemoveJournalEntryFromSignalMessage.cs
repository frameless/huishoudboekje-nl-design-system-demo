namespace Core.CommunicationModels.SignalModel.ConsumerMessages;

public class RemoveJournalEntryFromSignalMessage
{
  public IList<string> JournalEntryIds { get; set; }
}
