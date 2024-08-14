using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class GetAllQueryHandler(ISignalRepository signalRepository) : IQueryHandler<GetAll, IList<ISignalModel>>
{

  public Task<IList<ISignalModel>> HandleAsync(GetAll query)
  {
    return signalRepository.GetAll(query.Tracking, query.Filter);
  }
}
