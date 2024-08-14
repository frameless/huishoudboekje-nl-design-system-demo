using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.Queries;

internal record Update(UpdateModel AlarmUpdate) : IQuery<IAlarmModel>;
