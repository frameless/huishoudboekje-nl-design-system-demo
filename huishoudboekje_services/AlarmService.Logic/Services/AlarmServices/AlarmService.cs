using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.AlarmServices.QueryHandlers;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
namespace AlarmService.Logic.Services.AlarmServices;

public class AlarmService(
  IAlarmRepository alarmRepository,
  ISignalRepository signalRepository,
  ICheckAlarmProducer alarmProducer)
  : IAlarmService
{
  public Task<IAlarmModel> GetById(string id)
  {
    GetById query = new(id);
    GetByIdQueryHandler handler = new(alarmRepository);
    return handler.HandleAsync(query);
  }

  public Task<IList<IAlarmModel>> GetByIds(IList<string> ids)
  {
    GetByIds query = new(ids);
    GetByIdsQueryHandler handler = new(alarmRepository);
    return handler.HandleAsync(query);
  }

  public Task<IList<IAlarmModel>> GetActiveByIds(IList<string> ids)
  {
    GetActiveByIds query = new(ids);
    GetActiveByIdsQueryHandler handler = new(alarmRepository);
    return handler.HandleAsync(query);
  }

  public async Task<IAlarmModel> Create(IAlarmModel alarm, string agreementUuid)
  {
    Create query = new(alarm, agreementUuid);
    CreateQueryHandler handler = new(alarmRepository, alarmProducer);
    return await handler.HandleAsync(query);
  }

  public async Task<IAlarmModel> Update(UpdateModel alarm)
  {
    Update query = new(alarm);
    UpdateQueryHandler handler = new(alarmRepository);
    return await handler.HandleAsync(query);
  }

  public async Task<bool> Delete(string id)
  {
    Delete query = new(id);
    DeleteQueryHandler handler = new(alarmRepository, signalRepository);
    return await handler.HandleAsync(query);
  }

  public async Task<bool> DeleteByIds(IList<string> ids)
  {
    DeleteByIds query = new(ids);
    DeleteByIdsQueryHandler handler = new(alarmRepository);
    return await handler.HandleAsync(query);
  }

  public async Task<IList<IAlarmModel>> GetAllActiveByCheckOnDateBefore(DateTime date)
  {
    GetActiveByCheckOnDateBefore query = new(date);
    GetActiveByCheckOnDateBeforeQueryHandler handler = new(alarmRepository);
    return await handler.HandleAsync(query);
  }
}
