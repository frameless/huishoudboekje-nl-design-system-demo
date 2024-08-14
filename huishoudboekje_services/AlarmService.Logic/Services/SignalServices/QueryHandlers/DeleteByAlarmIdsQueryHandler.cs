using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class DeleteByAlarmIdsQueryHandler(ISignalRepository signalRepository) : IQueryHandler<DeleteByAlarmIds, bool>
{

  public Task<bool> HandleAsync(DeleteByAlarmIds query)
  {
    return signalRepository.DeleteByAlarmIds(query.Ids);
  }
}
