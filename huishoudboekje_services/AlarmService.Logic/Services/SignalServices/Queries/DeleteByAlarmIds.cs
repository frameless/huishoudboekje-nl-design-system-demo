using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record DeleteByAlarmIds(IList<string> Ids) : IQuery<bool>;
