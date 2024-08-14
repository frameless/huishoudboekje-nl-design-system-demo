using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class GetByIdQueryHandler(IAlarmRepository alarmRepository) : IQueryHandler<GetById, IAlarmModel>
{
  private readonly AlarmValidator _alarmValidator = new();

  public Task<IAlarmModel> HandleAsync(GetById query)
  {
    _alarmValidator.IsValid(query.Id);
    return alarmRepository.GetById(query.Id);
  }
}
