using AlarmService.Domain.Repositories.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.AlarmEvaluation.Reconciliation;

public class ReconciliationEvaluator(IDateTimeProvider dateTimeProvider, EvaluationHelper evaluationHelper)
{
  public EvaluationResult Evaluate(
    IDictionary<string, List<IJournalEntryModel>> journalEntriesPerAlarm,
    IDictionary<string, IAlarmModel> alarmsLookup,
    IDictionary<string, IList<IJournalEntryModel>> comparableJournalEntries,
    IDictionary<string, string> alarmToAgreement,
    IDictionary<string, string> alarmToCitizen,
    IDictionary<string, List<ISignalModel>> existingSignals)
  {
    EvaluationResult result = new();
    foreach (KeyValuePair<string, List<IJournalEntryModel>> info in journalEntriesPerAlarm)
    {
      IAlarmModel alarm = alarmsLookup[info.Key];
      IList<IJournalEntryModel> entriesInRange =
        evaluationHelper.DetermineJournalEntriesInRange(info.Value, alarmsLookup[info.Key]);
      Evaluation evaluation = new() { AlarmUuid = info.Key };
      foreach (IJournalEntryModel entry in entriesInRange)
      {
        IList<ISignalModel> signals = new List<ISignalModel>();

        IList<ISignalModel> signalsForThisJournalEntry = new List<ISignalModel>();
        if (existingSignals.ContainsKey(info.Key))
        {
          signalsForThisJournalEntry = existingSignals[info.Key]
            .Where(signal => signal.JournalEntryUuids.Any(uuid => uuid == entry.UUID)).ToList();
        }

        ISignalModel? amountSignal = CheckJournalEntryForAmountDifferences(
          alarm,
          entry,
          alarmToAgreement[alarm.UUID],
          alarmToCitizen[alarm.UUID]);
        if (amountSignal != null)
        {
          signals.Add(amountSignal);
        }

        // If this signal already exists
        // Can happen when the same journalentry is loaded 2x
        if (signalsForThisJournalEntry.All(signal => signal.Type != 3))
        {
          ISignalModel? multipleSignal =
            CheckJournalEntryForRepetition(
              entry,
              alarm,
              comparableJournalEntries[entry.AgreementUuid],
              alarmToAgreement[alarm.UUID],
              alarmToCitizen[alarm.UUID]);
          if (multipleSignal != null)
          {
            signals.Add(multipleSignal);
          }
        }

        if (DateIsInCurrentPeriod(entry.Date, alarm))
        {
          evaluation.NewCheckOnDate = evaluationHelper.DetermineNextCheckOnDate(
            GetCurrentAlarmPeriod(alarm).From.AddDays(alarm.DateMargin),
            alarm);
        }

        // add created signals to the existing list so we dont make the same one twice
        if (signals.Count > 0)
        {
          foreach (ISignalModel signal in signals)
          {
            evaluation.Signals.Add(signal);
          }
          if (existingSignals.ContainsKey(info.Key))
          {
            existingSignals[info.Key].AddRange(signals);
          }
          else
          {
            existingSignals[info.Key] = signals.ToList();
          }
        }
      }

      result.Evaluations.Add(evaluation);
    }

    return result;
  }

  private ISignalModel? CheckJournalEntryForRepetition(
    IJournalEntryModel entry,
    IAlarmModel alarm,
    IList<IJournalEntryModel> journalEntries,
    string agreementId,
    string citizenId)
  {
    Dictionary<DateTime, List<IJournalEntryModel>> periodSeperatedEntries =
      evaluationHelper.GetJournalEntriesWithMatchingPeriod(alarm, journalEntries);
    DateTime entryPeriod = evaluationHelper.GetAlarmDateForJournalEntry(entry, alarm);

    if (periodSeperatedEntries.ContainsKey(entryPeriod))
    {
      if (periodSeperatedEntries[entryPeriod].Count == 1 && periodSeperatedEntries[entryPeriod][0].UUID == entry.UUID)
      {
        return null;
      }

      int total = entry.Amount;
      List<string> entryIds = new List<string> { entry.UUID };
      foreach (IJournalEntryModel journalEntry in periodSeperatedEntries[entryPeriod])
      {
        if (journalEntry.UUID != entry.UUID)
        {
          total = +journalEntry.Amount;
          entryIds.Add(journalEntry.UUID);
        }
      }

      return new SignalModel()
      {
        Type = 3,
        IsActive = true,
        OffByAmount = total - alarm.Amount,
        CreatedAt = dateTimeProvider.UnixNow(),
        JournalEntryUuids = entryIds,
        AlarmUuid = alarm.UUID,
        CitizenUuid = citizenId,
        AgreementUuid = agreementId
      };
    }

    return null;
  }

  private ISignalModel? CheckJournalEntryForAmountDifferences(
    IAlarmModel alarm,
    IJournalEntryModel journalEntry,
    string agreementId,
    string citizenId)
  {
    int maxAmount = alarm.Amount + alarm.AmountMargin;
    int minAmount = alarm.Amount - alarm.AmountMargin;
    if (journalEntry.Amount > maxAmount || journalEntry.Amount < minAmount)
    {
      int difference = journalEntry.Amount - alarm.Amount;
      SignalModel signal = new SignalModel()
      {
        Type = 2,
        IsActive = true,
        OffByAmount = difference,
        CreatedAt = dateTimeProvider.UnixNow(),
        JournalEntryUuids = new List<string> { journalEntry.UUID },
        AlarmUuid = alarm.UUID,
        CitizenUuid = citizenId,
        AgreementUuid = agreementId
      };

      return signal;
    }

    return null;
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
