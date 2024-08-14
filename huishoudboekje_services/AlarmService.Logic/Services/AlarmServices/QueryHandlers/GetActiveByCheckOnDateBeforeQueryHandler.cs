using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using Grpc.Core;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class GetActiveByCheckOnDateBeforeQueryHandler(IAlarmRepository alarmRepository) : IQueryHandler<GetActiveByCheckOnDateBefore, IList<IAlarmModel>>
{

  public async Task<IList<IAlarmModel>> HandleAsync(GetActiveByCheckOnDateBefore query)
  {
    return await alarmRepository.GetActiveByCheckOnDateBeforeNoTracking(query.Date);
  }
}
