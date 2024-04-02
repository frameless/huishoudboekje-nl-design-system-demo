using System.Collections;
using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Domain.Repositories.Interfaces;

public interface ISignalRepository
{
  public Task<ISignalModel> GetById(string id);

  public Task<IList<ISignalModel>> GetAll(bool tracking, SignalFilterModel? filter = null);
  public Task<ISignalModel> Insert(ISignalModel value);
  public Task<bool> InsertMany(IList<ISignalModel> values);
  public Task<ISignalModel> Update(ISignalModel value);

  public Task<IList<ISignalModel>> GetByAlarmId(string alarmId);

  public Task<ISignalModel> SetIsActive(string id, bool isActive);

  public Task<Paged<ISignalModel>> GetPaged(Pagination pagination, SignalFilterModel? filter);
  public Task<bool> Delete(string id);

  public Task<int> GetActiveSignalsCount();
}
