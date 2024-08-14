using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class DeleteQueryHandler(IAlarmRepository alarmRepository, ISignalRepository signalRepository) : IQueryHandler<Delete, bool>
{
  private readonly AlarmValidator _alarmValidator = new();

  public async Task<bool> HandleAsync(Delete query)
  {
    _alarmValidator.IsValid(query.Id);
    await signalRepository.DeleteByAlarmIds([query.Id]);
    return await alarmRepository.Delete(query.Id);
  }
}
