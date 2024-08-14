using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class DeleteByCitizenIdsQueryHandler(ISignalRepository signalRepository) : IQueryHandler<DeleteByCitizenIds, bool>
{

  public Task<bool> HandleAsync(DeleteByCitizenIds query)
  {
    return signalRepository.DeleteByCitizenIds(query.Ids);
  }
}
