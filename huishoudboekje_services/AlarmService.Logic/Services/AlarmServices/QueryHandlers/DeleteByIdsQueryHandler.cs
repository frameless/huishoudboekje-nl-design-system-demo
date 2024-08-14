using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using LinqKit;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class DeleteByIdsQueryHandler(IAlarmRepository alarmRepository) : IQueryHandler<DeleteByIds, bool>
{
  private readonly AlarmValidator _alarmValidator = new();

  public async Task<bool> HandleAsync(DeleteByIds query)
  {
    query.Ids.ForEach(id => _alarmValidator.IsValid(id));
    return await alarmRepository.DeleteByIds(query.Ids);
  }
}
