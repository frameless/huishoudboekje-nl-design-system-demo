using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Logic.Services.AlarmServices.Queries;

internal record Delete(string Id) : IQuery<bool>;
