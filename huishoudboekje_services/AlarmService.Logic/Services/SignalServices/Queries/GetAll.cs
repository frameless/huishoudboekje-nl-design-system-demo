using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record GetAll(bool Tracking, SignalFilterModel? Filter) : IQuery<IList<ISignalModel>>;
