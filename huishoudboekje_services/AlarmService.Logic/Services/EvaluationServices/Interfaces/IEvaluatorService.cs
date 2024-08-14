using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.Interfaces;

public interface IEvaluatorService
{
  public Task<bool> EvaluateReconciliatedJournalEntries(
    IDictionary<string, string> agreementAlarms,
    IList<IJournalEntryModel> reconcilliatedEntries,
    IDictionary<string, string> alarmToCitizen);

  public Task<bool> EvaluateCitizenSaldos(IList<string> citizenUuids, int threshold);

  public Task<bool> EvaluateMissingTransactionAlarms();
}
