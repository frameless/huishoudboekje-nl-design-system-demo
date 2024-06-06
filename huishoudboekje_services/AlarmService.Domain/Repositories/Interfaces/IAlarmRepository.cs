using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Domain.Repositories.Interfaces;

public interface IAlarmRepository
{
  public Task<IAlarmModel> GetById(string id);
  public Task<IList<IAlarmModel>> GetMultipleByIds(IList<string> ids);
  public Task<IList<IAlarmModel>> GetMultipleByIdsNoTracking(IList<string> ids);
  public Task<IAlarmModel> InsertWithoutSave(IAlarmModel value);
  public Task<IAlarmModel> Update(UpdateModel value);
  public Task<bool> UpdateMany(IList<IAlarmModel> value);
  public Task<IList<IAlarmModel>> GetAllByCheckOnDateBeforeNoTracking(DateTime date);
  public Task<bool> Delete(string id);

  public Task<bool> DeleteByIds(IList<string> ids);

  public Task SaveChanges();
}
