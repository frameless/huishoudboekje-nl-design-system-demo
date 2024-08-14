using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class SetIsActiveQueryHandler(ISignalRepository signalRepository) : IQueryHandler<SetIsActive, ISignalModel>
{

  public Task<ISignalModel> HandleAsync(SetIsActive query)
  {
    return signalRepository.SetIsActive(query.Id, query.IsActive);
  }
}
