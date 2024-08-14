using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.Queries;

internal record GetActiveByCheckOnDateBefore(DateTime Date) : IQuery<IList<IAlarmModel>>;
