using AlarmService.Logic.Helpers;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Evaluators.AlarmEvaluators.Reconciliation;

public class ReconciliationEvaluator(IDateTimeProvider dateTimeProvider, CheckOnDateHelper checkOnDateHelper, EvaluationHelper evaluationHelper) : BaseEvaluator<AlarmEvaluationInfo>
{

  protected override Evaluation? GetEvaluation(AlarmEvaluationInfo evaluationInfo)
  {
    IList<IJournalEntryModel> entriesInRange = evaluationHelper.DetermineJournalEntriesInRange(evaluationInfo.NewJournalEntries, evaluationInfo.Alarm);
    return EvaluateAlarmJournalEntries(evaluationInfo, entriesInRange);
  }

  protected override string PrintError(AlarmEvaluationInfo evaluationInfo)
  {
    return dateTimeProvider.Now() + "Error evaluating reconiliation, alarm id: " + evaluationInfo.Alarm.UUID;
  }

  private Evaluation? EvaluateAlarmJournalEntries(AlarmEvaluationInfo evaluationInfo, IList<IJournalEntryModel> entriesInRange)
  {
    Evaluation evaluation = new()
    {
      Alarm = (AlarmModel)evaluationInfo.Alarm
    };

    IList<ISignalModel> signals = new List<ISignalModel>();
    foreach (IJournalEntryModel entry in entriesInRange)
    {
      if(entry.Date < evaluationInfo.Alarm.StartDate) continue;

      ISignalModel? amountSignal = CheckJournalEntryForAmountDifferences(evaluationInfo, entry);
      if (amountSignal != null) signals.Add(amountSignal);

      if (ShouldCheckForRepetition(evaluationInfo, signals, entry))
      {
        ISignalModel? multipleSignal = CheckJournalEntryForRepetition(evaluationInfo, entry);
        if (multipleSignal != null) signals.Add(multipleSignal);
      }

      if (DateIsInCurrentPeriod(entry.Date, evaluationInfo.Alarm))
      {
        evaluation.NewCheckOnDate = checkOnDateHelper.DetermineNextCheckOnDate(
          GetCurrentAlarmPeriod(evaluationInfo.Alarm).From.AddDays(evaluationInfo.Alarm.DateMargin),
          evaluationInfo.Alarm);
      }
    }
    evaluation.Signals.AddRange(signals);
    return evaluation;
  }

  private static bool ShouldCheckForRepetition(AlarmEvaluationInfo info,  IList<ISignalModel> newSignals, IJournalEntryModel entry)
  {
    return info.ExistingSignals
             .Where(signal =>
               signal.JournalEntryUuids != null && signal.JournalEntryUuids.Any(uuid => uuid == entry.UUID))
             .All(signal => signal.Type != 3)
           && newSignals
             .Where(signal =>
               signal.JournalEntryUuids != null && signal.JournalEntryUuids.Any(uuid => uuid == entry.UUID))
             .All(signal => signal.Type != 3);
  }

  private ISignalModel? CheckJournalEntryForRepetition(
    AlarmEvaluationInfo info,
    IJournalEntryModel entry)
  {
    DateTime entryPeriod = evaluationHelper.GetAlarmDateForJournalEntry(entry, info.Alarm);

    if (!info.PeriodSeperatedEntries.TryGetValue(entryPeriod, out List<IJournalEntryModel>? periodSeperatedEntriesEntryPeriod))
    {
      return null;
    }
    if (periodSeperatedEntriesEntryPeriod.Count == 1 && periodSeperatedEntriesEntryPeriod[0].UUID == entry.UUID)
    {
      return null;
    }

    int total = entry.Amount;
    List<string> entryIds = [entry.UUID];
    foreach (IJournalEntryModel journalEntry in periodSeperatedEntriesEntryPeriod.Where(journalEntry => journalEntry.UUID != entry.UUID))
    {
      total = +journalEntry.Amount;
      entryIds.Add(journalEntry.UUID);
    }

    return new SignalModel()
    {
      Type = 3,
      IsActive = true,
      OffByAmount = total - info.Alarm.Amount,
      CreatedAt = dateTimeProvider.UnixNow(),
      JournalEntryUuids = entryIds,
      AlarmUuid = info.Alarm.UUID,
      CitizenUuid = info.CitizenId,
      AgreementUuid = info.AgreementId
    };

  }

  private ISignalModel? CheckJournalEntryForAmountDifferences(
    AlarmEvaluationInfo info,
    IJournalEntryModel journalEntry)
  {
    int maxAmount = info.Alarm.Amount + info.Alarm.AmountMargin;
    int minAmount = info.Alarm.Amount - info.Alarm.AmountMargin;
    if (journalEntry.Amount <= maxAmount && journalEntry.Amount >= minAmount) return null;
    int difference = journalEntry.Amount - info.Alarm.Amount;
    return new SignalModel()
    {
      Type = 2,
      IsActive = true,
      OffByAmount = difference,
      CreatedAt = dateTimeProvider.UnixNow(),
      JournalEntryUuids = new List<string> { journalEntry.UUID },
      AlarmUuid = info.Alarm.UUID,
      CitizenUuid = info.CitizenId,
      AgreementUuid = info.AgreementId
    };
  }

  private DateRange GetCurrentAlarmPeriod(IAlarmModel alarm)
  {
    DateTime end = dateTimeProvider.EndOfDay(dateTimeProvider.UnixToDateTime((long)alarm.CheckOnDate).AddDays(-1));
    DateTime start = dateTimeProvider.StartOfDay(end.AddDays(-(alarm.DateMargin * 2)));
    return new DateRange() { From = start, To = end };
  }

  private bool DateIsInCurrentPeriod(long date, IAlarmModel alarm)
  {
    DateTime datetime = dateTimeProvider.UnixToDateTime(date).Date;
    DateRange currentPeriod = GetCurrentAlarmPeriod(alarm);
    IList<DateTime> datesInRange = currentPeriod.GetDatesInRange();
    return datesInRange.Contains(datetime);
  }
}
