using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record GetActiveCount() : IQuery<int>;
