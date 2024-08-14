using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Evaluators.AlarmEvaluators;

public class AlarmEvaluationInfo
{
  public IAlarmModel Alarm { get; set; }
  public string AgreementId { get; set; }
  public string CitizenId { get; set; }
  public IList<IJournalEntryModel> NewJournalEntries { get; set; }
  public Dictionary<DateTime, List<IJournalEntryModel>> PeriodSeperatedEntries { get; set; }
  public IList<ISignalModel> ExistingSignals { get; set; }

}
