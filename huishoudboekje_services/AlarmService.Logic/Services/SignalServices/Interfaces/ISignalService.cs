using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Interfaces;

public interface ISignalService
{

  public Task<IList<ISignalModel>> GetAll(bool tracking, SignalFilterModel? filter);

  public Task<ISignalModel> SetIsActive(string id, bool isActive);

  public Task<Paged<ISignalModel>> GetItemsPaged(Pagination pagination, SignalFilterModel? filter);

  public Task<int> GetActiveSignalsCount();

  public Task<bool> DeleteByAlarmIds(IList<string> ids);

  public Task<bool> DeleteByCitizenIds(IList<string> ids);

  public Task HandleJournalEntryDeletion(IList<string> journalEntryIds);
}
