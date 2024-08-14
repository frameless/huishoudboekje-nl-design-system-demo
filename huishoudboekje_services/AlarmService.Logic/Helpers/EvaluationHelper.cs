using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using Core.utils.InputValidation;

namespace AlarmService.Logic.Helpers;

public class EvaluationHelper(IDateTimeProvider dateTimeProvider)
{
  public IList<IJournalEntryModel> DetermineJournalEntriesInRange(
    IList<IJournalEntryModel> journalEntries,
    IAlarmModel alarm)
  {
    if (alarm.AlarmType == 1 || alarm.AlarmType == 4)
    {
      return journalEntries.Where(entry => IsJournalEntryInMonthlyOrYearlyAlarmPeriod(alarm, entry)).ToList();
    }

    if (alarm.AlarmType == 2)
    {
      return journalEntries.Where(entry => IsJournalEntryInWeeklyAlarmPeriod(alarm, entry)).ToList();
    }

    if (alarm.AlarmType == 3)
    {
      return journalEntries.Where(entry => IsJournalEntryInOneTimeAlarmPeriod(alarm, entry)).ToList();
    }

    throw new IncorrectInputException($"Alarm of type {alarm.AlarmType} is not supported by this application");
  }

  public DateRange GetJournalEntryDatesWithinAlarmMargin(long journalEntryDate, int alarmMargin)
  {
    DateTime entryDate = dateTimeProvider.UnixToDateTime(journalEntryDate);
    DateTime start = entryDate.AddDays(-alarmMargin);
    DateTime end = entryDate.AddDays(alarmMargin);
    return new DateRange() { From = start.Date, To = end.Date };
  }

  public Dictionary<DateTime, List<IJournalEntryModel>> GetJournalEntriesWithMatchingPeriod(IAlarmModel alarm, IList<IJournalEntryModel> journalEntries)
  {
    journalEntries = DetermineJournalEntriesInRange(journalEntries, alarm);


    Dictionary<DateTime, List<IJournalEntryModel>> entries = journalEntries
      .GroupBy(entry => GetAlarmDateForJournalEntry(entry, alarm))
      .ToDictionary(group => group.Key, group => group.ToList());

    return entries;
  }

  public DateTime GetAlarmDateForJournalEntry(IJournalEntryModel entry, IAlarmModel alarm)
  {
    return alarm.AlarmType switch
    {
      1 or 4 => GetDateTimeRangeForTransactionOnAlarmMargin(entry, alarm.DateMargin)
        .FirstOrDefault(date => alarm.RecurringMonths.Contains(date.Month) && alarm.RecurringDayOfMonth.Contains(date.Day)),
      2 => GetDateTimeRangeForTransactionOnAlarmMargin(entry, alarm.DateMargin)
        .FirstOrDefault(date => alarm.RecurringDay.Contains((int)date.DayOfWeek)),
      3 => GetDateTimeRangeForTransactionOnAlarmMargin(entry, alarm.DateMargin)
        .FirstOrDefault(date => date.Date == dateTimeProvider.UnixToDateTime((long)alarm.EndDate).Date),
      _ => throw new IncorrectInputException($"Alarm of type {alarm.AlarmType} is not supported by this application")
    };
  }

  private bool IsJournalEntryInMonthlyOrYearlyAlarmPeriod(IAlarmModel alarm, IJournalEntryModel journalEntry)
  {
    IList<DateTime> dateRange = GetDateTimeRangeForTransactionOnAlarmMargin(journalEntry, alarm.DateMargin);

    return dateRange.Any(
      date => alarm.RecurringMonths.Contains(date.Month) && alarm.RecurringDayOfMonth.Contains(date.Day));
  }

  private bool IsJournalEntryInWeeklyAlarmPeriod(IAlarmModel alarm, IJournalEntryModel journalEntry)
  {
    IList<DateTime> dateRange = GetDateTimeRangeForTransactionOnAlarmMargin(journalEntry, alarm.DateMargin);

    return dateRange.Any(date => alarm.RecurringDay.Contains((int)date.DayOfWeek));
  }

  private bool IsJournalEntryInOneTimeAlarmPeriod(IAlarmModel alarm, IJournalEntryModel journalEntry)
  {
    IList<DateTime> dateRange = GetDateTimeRangeForTransactionOnAlarmMargin(journalEntry, alarm.DateMargin);

    return dateRange.Any(
      date => date.Date == dateTimeProvider.UnixToDateTime((long)alarm.EndDate).Date);
  }

  private IList<DateTime> GetDateTimeRangeForTransactionOnAlarmMargin(
    IJournalEntryModel journalEntry,
    int alarmMargin)
  {
    DateRange range = GetJournalEntryDatesWithinAlarmMargin(journalEntry.Date, alarmMargin);
    return range.GetDatesInRange();
  }

}
