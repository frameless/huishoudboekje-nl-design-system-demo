using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Controllers.Signal;

public interface ISignalController
{
  public Task<ISignalModel> GetById(string id);
  public Task<ISignalModel> Create(ISignalModel value);

  public Task<IList<ISignalModel>> GetAll(bool tracking);

  public Task<bool> CreateMany(IList<ISignalModel> values);
  public Task<ISignalModel> Update(ISignalModel value);

  public Task<IList<ISignalModel>> GetByAlarmId(string alarmId);

  public Task<ISignalModel> SetIsActive(string id, bool isActive);

  public Task<Paged<ISignalModel>> GetItemsPaged(Pagination pagination, SignalFilterModel? filter);
  public Task<bool> Delete(string id);

  public Task<int> GetActiveSignalsCount();

  public Task<bool> DeleteByAlarmIds(IList<string> ids);

  public Task<bool> DeleteByCitizenIds(IList<string> ids);
}
