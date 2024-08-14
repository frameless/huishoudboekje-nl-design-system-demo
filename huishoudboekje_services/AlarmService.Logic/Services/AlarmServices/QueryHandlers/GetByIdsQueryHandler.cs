using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class GetByIdsQueryHandler(IAlarmRepository alarmRepository) : IQueryHandler<GetByIds, IList<IAlarmModel>>
{
  private readonly AlarmValidator _alarmValidator = new();

  public Task<IList<IAlarmModel>> HandleAsync(GetByIds query)
  {
    List<string> filteredIds = query.Ids.Where(id => !string.IsNullOrEmpty(id)).ToList();
    foreach (string id in filteredIds)
    {
      _alarmValidator.IsValid(id);
    }
    return alarmRepository.GetMultipleByIds(filteredIds);
  }
}
