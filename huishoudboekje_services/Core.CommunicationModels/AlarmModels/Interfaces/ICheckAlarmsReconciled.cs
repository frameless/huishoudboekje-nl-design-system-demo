using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.AlarmModels.Interfaces;

public interface ICheckAlarmsReconciled
{
  public IDictionary<string, string> AgreementToAlarm { get; }

  public IList<IJournalEntryModel> ReconciledJournalEntries { get; }
  public IDictionary<string, string> AlarmToCitizen { get; }
}
