using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.Queries;

internal record Create(IAlarmModel Alarm, string AgreementId) : IQuery<IAlarmModel>;
