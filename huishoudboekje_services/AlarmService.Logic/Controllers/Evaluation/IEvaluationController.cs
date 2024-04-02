using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace AlarmService.Logic.Controllers.Evaluation;

public interface IEvaluationController
{
  public Task<bool> EvaluateReconciliatedJournalEntries(
    IDictionary<string, string> agreementAlarms,
    IList<IJournalEntryModel> reconcilliatedEntries,
    IDictionary<string, string> alarmToCitizen);

  public Task<bool> EvaluateBurgerSaldos(IList<string> citizenUuids, int threshhold);

  public Task<bool> EvaluateMissingTransactionAlarms();
}
