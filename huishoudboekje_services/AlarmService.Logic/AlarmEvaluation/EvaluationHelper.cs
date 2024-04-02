using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using Core.utils.InputValidation;

namespace AlarmService.Logic.AlarmEvaluation;

public class EvaluationHelper(IDateTimeProvider dateTimeProvider)
{
  public long? DetermineFirstCheckOnDate(DateTime startDate, IAlarmModel alarm)
  {
    long? checkOnDate = null;
    switch (alarm.AlarmType)
    {
      case 1:
      case 4:
        checkOnDate = DetermineFirstMonthlyOrYearlyDate(startDate, alarm);
        break;
      case 2:
        checkOnDate = DetermineFirstWeeklyDate(startDate, alarm);
        break;
      case 3:
        checkOnDate = dateTimeProvider.DateTimeToUnix(startDate.AddDays(alarm.DateMargin + 1).Date);
        break;
    }
    return checkOnDate > alarm.EndDate && alarm.StartDate != alarm.EndDate ? null : checkOnDate;
  }

  public long? DetermineNextCheckOnDate(DateTime currentDate, IAlarmModel alarm)
  {
    if (alarm.AlarmType == 1 || alarm.AlarmType == 4)
    {
      return DetermineMonthlyOrYearlyDate(currentDate, alarm);
    }

    if (alarm.AlarmType == 2)
    {
      return DetermineWeeklyDate(currentDate, alarm);
    }

    return null;
  }

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

  private long? DetermineWeeklyDate(DateTime currentDate, IAlarmModel alarm)
  {
    // List cannot be null for yearly or monthly alarms, if it is an error is allowed.
    int nextDayNumber = GetNextIntInRecurringList(alarm.RecurringDay.ToList(), (int)currentDate.DayOfWeek);
    int dayDifference = CalculateDaysToNewDayOfWeeks(nextDayNumber, (int)currentDate.DayOfWeek);

    var newCheckOnDate =
      dateTimeProvider.DateTimeToUnix(currentDate.AddDays(dayDifference).AddDays(alarm.DateMargin + 1));

    if (newCheckOnDate > alarm.EndDate)
    {
      return null;
    }

    return newCheckOnDate;
  }

  private long? DetermineMonthlyOrYearlyDate(DateTime currentDate, IAlarmModel alarm)
  {
    // List cannot be null for yearly or monthly alarms, if it is an error is allowed.
    int day = GetNextIntInRecurringList(alarm.RecurringDayOfMonth.ToList(), currentDate.Day);
    int month = day <= currentDate.Day
      ? GetNextIntInRecurringList(alarm.RecurringMonths.ToList(), currentDate.Month)
      : currentDate.Month;
    int year = month <= currentDate.Month && day <= currentDate.Day ? currentDate.Year + 1 : currentDate.Year;

    long newCheckOnDate = dateTimeProvider.DateTimeToUnix(
      dateTimeProvider.DateAsUtc(new DateTime(year, month, day)).AddDays(alarm.DateMargin + 1));

    if (newCheckOnDate > alarm.EndDate)
    {
      return null;
    }

    return newCheckOnDate;
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

  private int GetNextIntInRecurringList(List<int> list, int current)
  {
    List<int> orderedList = list.Order().ToList();
    int indexOfCurrent = orderedList.IndexOf(current);
    return indexOfCurrent == orderedList.Count - 1 ? orderedList.First() : orderedList[indexOfCurrent + 1];
  }

  private int CalculateDaysToNewDayOfWeeks(int newDay, int oldDay)
  {
    // 1 + 7 (newDayOfWeek - oldDayOfWeek) % 7) -1 gives us the difference in days to reach the next day of week.
    // If we simply subtracted the weeks, we would incorrectly go back in time instead of forwards.
    return 1 + 7 + ((newDay - oldDay) % 7) - 1;
  }

  private IList<DateTime> GetDateTimeRangeForTransactionOnAlarmMargin(
    IJournalEntryModel journalEntry,
    int alarmMargin)
  {
    DateRange range = GetJournalEntryDatesWithinAlarmMargin(journalEntry.Date, alarmMargin);
    return range.GetDatesInRange();
  }

  private long? DetermineFirstWeeklyDate(DateTime startDate, IAlarmModel alarm)
  {
    int nextDayNumber = alarm.RecurringDay!.FirstOrDefault(
      day => day + alarm.DateMargin >= (int)startDate.DayOfWeek,
      alarm.RecurringDay![0]);
    int dayDifference = CalculateDaysToNewDayOfWeeks(nextDayNumber, (int)startDate.DayOfWeek);
    if (dayDifference > 7)
    {
      dayDifference -= 7;
    }
    return dateTimeProvider.DateTimeToUnix(startDate.AddDays(dayDifference).AddDays(alarm.DateMargin + 1).Date);
  }

  private long? DetermineFirstMonthlyOrYearlyDate(DateTime startDate, IAlarmModel alarm)
  {
    int day = alarm.RecurringDayOfMonth!.FirstOrDefault(
      day => day + alarm.DateMargin >= startDate.Day,
      alarm.RecurringDayOfMonth![0]);
    int month = day + alarm.DateMargin < startDate.Day
      ? alarm.RecurringMonths!.FirstOrDefault(
        month => month > startDate.Month,
        alarm.RecurringMonths![0])
      : alarm.RecurringMonths!.FirstOrDefault(
        month => month >= startDate.Month,
        alarm.RecurringMonths![0]);

    int year = month < startDate.Month || (month == startDate.Month && day + alarm.DateMargin + 1 <= startDate.Day)
      ? startDate.Year + 1
      : startDate.Year;

    return dateTimeProvider.DateTimeToUnix(
      dateTimeProvider.DateAsUtc(new DateTime(year, month, day)).AddDays(alarm.DateMargin + 1));
  }
}
