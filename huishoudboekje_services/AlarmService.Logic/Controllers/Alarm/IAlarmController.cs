using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace AlarmService.Logic.Controllers.Alarm;

public interface IAlarmController
{
  public Task<IAlarmModel> GetById(string id);
  public Task<IList<IAlarmModel>> GetByIds(IList<string> ids);
  public Task<IAlarmModel> Create(IAlarmModel alarm, string agreementUuid);
  public Task<IAlarmModel> Update(UpdateModel alarm);
  public Task<IList<IAlarmModel>> GetAllBeforeByCheckOnDateBefore(DateTime date);
  public Task<bool> Delete(string id);
}
