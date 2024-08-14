using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.Interfaces;

public interface IAlarmService
{
  public Task<IAlarmModel> GetById(string id);
  public Task<IList<IAlarmModel>> GetByIds(IList<string> ids);
  public Task<IList<IAlarmModel>> GetActiveByIds(IList<string> ids);
  public Task<IAlarmModel> Create(IAlarmModel alarm, string agreementUuid);
  public Task<IAlarmModel> Update(UpdateModel alarm);
  public Task<IList<IAlarmModel>> GetAllActiveByCheckOnDateBefore(DateTime date);
  public Task<bool> Delete(string id);

  public Task<bool> DeleteByIds(IList<string> ids);
}
