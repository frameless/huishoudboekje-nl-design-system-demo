using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.AlarmModels;


// TODO: Probably a lot of this data should be on demand through MSQ when available.
// Due to current setup using REST towards old services this is not recommended due to
// DB invalidates & decreased performance.
public class CheckSaldos : ICheckSaldos
{
  public IList<string> AffectedCitizens { get; set; }

  public int SaldoThreshold { get; set; }
}
