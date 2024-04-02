using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.EditAlarmService.Interface;
using Core.CommunicationModels;

namespace AlarmService.Logic.EditAlarmService;

public class EditAlarmService(IAlarmRepository alarmRepository) : IEditAlarmService
{
  public Task UpdateEndDateAlarm(string alarmUuid, long endDateUnix)
  {
    UpdateModel updateModel = new()
    {
      Uuid = alarmUuid,
      Updates = new Dictionary<string, object> { { "EndDate", endDateUnix } }
    };
    return alarmRepository.Update(updateModel);
  }
}
