using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class GetActiveCountQueryHandler(ISignalRepository signalRepository) : IQueryHandler<GetActiveCount, int>
{

  public Task<int> HandleAsync(GetActiveCount query)
  {
    return signalRepository.GetActiveSignalsCount();
  }
}
