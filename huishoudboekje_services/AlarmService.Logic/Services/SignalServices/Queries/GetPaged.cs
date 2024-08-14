using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record GetPaged(Pagination Pagination, SignalFilterModel? Filter) : IQuery<Paged<ISignalModel>>;
