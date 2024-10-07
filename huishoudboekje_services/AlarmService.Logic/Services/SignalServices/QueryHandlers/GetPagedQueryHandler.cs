using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Queries;
using Core.CommunicationModels;
using Core.CommunicationModels.Notifications;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.QueryHandlers;

internal class GetPagedQueryHandler(ISignalRepository signalRepository) : IQueryHandler<GetPaged, Paged<ISignalModel>>
{
  public Task<Paged<ISignalModel>> HandleAsync(GetPaged query)
  {
    return signalRepository.GetPaged(query.Pagination, query.Filter);
  }
}
