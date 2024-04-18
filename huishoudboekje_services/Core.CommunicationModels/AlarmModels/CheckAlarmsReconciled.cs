using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.AlarmModels;


// TODO: Probably a lot of this data should be on demand through MSQ when available.
// Due to current setup using REST towards old services this is not recommended due to
// DB invalidates & decreased performance.
public class CheckAlarmsReconciled : ICheckAlarmsReconciled
{
  public IDictionary<string, string> AgreementToAlarm { get; set; }

  public IList<IJournalEntryModel> ReconciledJournalEntries { get; set; }

  public IDictionary<string, string> AlarmToCitizen { get; set; }

}
