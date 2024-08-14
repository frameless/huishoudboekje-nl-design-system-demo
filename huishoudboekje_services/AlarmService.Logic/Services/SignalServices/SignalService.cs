using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using AlarmService.Logic.Services.SignalServices.QueryHandlers;
using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices;

public class SignalService(ISignalRepository signalRepository) : ISignalService
{

  public Task<IList<ISignalModel>> GetAll(bool tracking, SignalFilterModel? filter)
  {
    GetAll query = new(tracking, filter);
    GetAllQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }
  public Task<ISignalModel> SetIsActive(string id, bool isActive)
  {
    SetIsActive query = new(id, isActive);
    SetIsActiveQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }

  public Task<Paged<ISignalModel>> GetItemsPaged(Pagination pagination, SignalFilterModel? filter)
  {
    GetPaged query = new(pagination, filter);
    GetPagedQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }

  public Task<int> GetActiveSignalsCount()
  {
    GetActiveCount query = new();
    GetActiveCountQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }

  public Task<bool> DeleteByAlarmIds(IList<string> ids)
  {
    DeleteByAlarmIds query = new(ids);
    DeleteByAlarmIdsQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }

  public Task<bool> DeleteByCitizenIds(IList<string> ids)
  {
    DeleteByCitizenIds query = new(ids);
    DeleteByCitizenIdsQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }

  public Task HandleJournalEntryDeletion(IList<string> journalEntryIds)
  {
    HandleJournalEntryDeletion query = new(journalEntryIds);
    HandleJournalEntryDeletionQueryHandler handler = new(signalRepository);
    return handler.HandleAsync(query);
  }
}
