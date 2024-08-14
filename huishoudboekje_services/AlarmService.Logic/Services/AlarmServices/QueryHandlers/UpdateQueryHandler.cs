using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using Grpc.Core;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class UpdateQueryHandler(IAlarmRepository alarmRepository) : IQueryHandler<Update, IAlarmModel>
{
  private readonly AlarmValidator _alarmValidator = new();

  public async Task<IAlarmModel> HandleAsync(Update query)
  {
    _alarmValidator.IsValid(query.AlarmUpdate.Uuid);
    //TODO validate rest?

    IAlarmModel alarm = await alarmRepository.GetById(query.AlarmUpdate.Uuid);
    query.AlarmUpdate.Updates.Remove(nameof(IAlarmModel.CheckOnDate)); //Only backend should update checkOnDate
    if(ShouldCheckToUpdateIsActive(query, out object? newEndDate))
    {
      query.AlarmUpdate.Updates.Add(nameof(alarm.IsActive), NewIsActive(newEndDate, alarm));
    }
    return await alarmRepository.Update(query.AlarmUpdate);
  }

  private bool? NewIsActive(object? newEndDate, IAlarmModel alarm)
  {
    return (long)newEndDate > alarm.CheckOnDate;
  }

  private bool ShouldCheckToUpdateIsActive(Update query, out object? newEndDate)
  {
    return query.AlarmUpdate.Updates.TryGetValue(nameof(IAlarmModel.EndDate), out newEndDate);
  }
}
