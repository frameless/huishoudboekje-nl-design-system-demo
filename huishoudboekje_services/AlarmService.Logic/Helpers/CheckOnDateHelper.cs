using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Helpers;

public class CheckOnDateHelper(IDateTimeProvider dateTimeProvider)
{
  public long? DetermineFirstCheckOnDate(DateTime startDate, IAlarmModel alarm)
  {
    long? checkOnDate = alarm.AlarmType switch
    {
      1 or 4 => DetermineFirstMonthlyOrYearlyDate(startDate, alarm),
      2 => DetermineFirstWeeklyDate(startDate, alarm),
      3 => dateTimeProvider.DateTimeToUnix(startDate.AddDays(alarm.DateMargin + 1).Date),
      _ => null
    };
    return checkOnDate > alarm.EndDate && alarm.StartDate != alarm.EndDate ? null : checkOnDate;
  }

  public long? DetermineNextCheckOnDate(DateTime currentDate, IAlarmModel alarm)
  {
    return alarm.AlarmType switch
    {
      1 or 4 => DetermineMonthlyOrYearlyDate(currentDate, alarm),
      2 => DetermineWeeklyDate(currentDate, alarm),
      _ => null
    };
  }

  private long DetermineWeeklyDate(DateTime currentDate, IAlarmModel alarm)
  {
    // List cannot be null for yearly or monthly alarms, if it is an error is allowed.
    int nextDayNumber = GetNextIntInRecurringList(alarm.RecurringDay.ToList(), (int)currentDate.DayOfWeek);
    int dayDifference = CalculateDaysToNewDayOfWeeks(nextDayNumber, (int)currentDate.DayOfWeek);

    long newCheckOnDate =
      dateTimeProvider.DateTimeToUnix(currentDate.AddDays(dayDifference).AddDays(alarm.DateMargin + 1));
    return newCheckOnDate;
  }

  private long DetermineMonthlyOrYearlyDate(DateTime currentDate, IAlarmModel alarm)
  {
    // List cannot be null for yearly or monthly alarms, if it is an error is allowed.
    int day = GetNextIntInRecurringList(alarm.RecurringDayOfMonth.ToList(), currentDate.Day);
    int month = day <= currentDate.Day
      ? GetNextIntInRecurringList(alarm.RecurringMonths.ToList(), currentDate.Month)
      : currentDate.Month;
    int year = month <= currentDate.Month && day <= currentDate.Day ? currentDate.Year + 1 : currentDate.Year;

    long newCheckOnDate = dateTimeProvider.DateTimeToUnix(
      dateTimeProvider.DateAsUtc(new DateTime(year, month, day)).AddDays(alarm.DateMargin + 1));
    return newCheckOnDate;
  }

  private int GetNextIntInRecurringList(List<int> list, int current)
  {
    List<int> orderedList = list.Order().ToList();
    int indexOfCurrent = orderedList.IndexOf(current);
    return indexOfCurrent == orderedList.Count - 1 ? orderedList.First() : orderedList[indexOfCurrent + 1];
  }

  private long DetermineFirstWeeklyDate(DateTime startDate, IAlarmModel alarm)
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

  private long DetermineFirstMonthlyOrYearlyDate(DateTime startDate, IAlarmModel alarm)
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

  private int CalculateDaysToNewDayOfWeeks(int newDay, int oldDay)
  {
    // 1 + 7 (newDayOfWeek - oldDayOfWeek) % 7) -1 gives us the difference in days to reach the next day of week.
    // If we simply subtracted the weeks, we would incorrectly go back in time instead of forwards.
    return 1 + 7 + ((newDay - oldDay) % 7) - 1;
  }
}
