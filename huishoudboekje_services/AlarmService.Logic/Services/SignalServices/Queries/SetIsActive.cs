using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record SetIsActive(string Id, bool IsActive) : IQuery<ISignalModel>;
