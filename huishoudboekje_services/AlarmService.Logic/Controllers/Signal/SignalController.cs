using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.InputValidators;
using Core.CommunicationModels;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Controllers.Signal;

public class SignalController : ISignalController
{
  private readonly SignalValidator signalValidator = new();
  private readonly ISignalRepository signalRepository;
  public SignalController(ISignalRepository signalRepository)
  {
    this.signalRepository = signalRepository;
  }

  public Task<ISignalModel> GetById(string id)
  {
    signalValidator.IsValid(id);
    return signalRepository.GetById(id);
  }

  public Task<IList<ISignalModel>> GetAll(bool tracking)
  {
    return signalRepository.GetAll(tracking);
  }


  public Task<ISignalModel> Create(ISignalModel alarm)
  {
    signalValidator.IsValid(alarm);
    return signalRepository.Insert(alarm);
  }

  public Task<ISignalModel> Update(ISignalModel alarm)
  {
    signalValidator.IsValid(alarm);
    return signalRepository.Update(alarm);
  }

  public Task<IList<ISignalModel>> GetByAlarmId(string alarmId)
  {
    return signalRepository.GetByAlarmId(alarmId);
  }

  public Task<ISignalModel> SetIsActive(string id, bool isActive)
  {
    return signalRepository.SetIsActive(id, isActive);
  }

  public Task<Paged<ISignalModel>> GetItemsPaged(Pagination pagination, SignalFilterModel? filter)
  {
    return signalRepository.GetPaged(pagination, filter);
  }

  public Task<bool> Delete(string id)
  {
    signalValidator.IsValid(id);
    return signalRepository.Delete(id);
  }

  public Task<int> GetActiveSignalsCount()
  {
    return signalRepository.GetActiveSignalsCount();
  }

  public Task<bool> CreateMany(IList<ISignalModel> values)
  {
    return signalRepository.InsertMany(values);
  }

  public Task<bool> DeleteByAlarmIds(IList<string> ids)
  {
    return signalRepository.DeleteByAlarmIds(ids);
  }

  public Task<bool> DeleteByCitizenIds(IList<string> ids)
  {
    return signalRepository.DeleteByCitizenIds(ids);
  }
}
