namespace AlarmService.Logic.EditAlarmService.Interface;

public interface IEditAlarmService
{
  public Task UpdateEndDateAlarm(string alarmUuid, long endDateUnix);
}
