using AlarmService_RPC;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Grpc.Mapper;

public interface ISignalMapper
{
    public SignalData GetGrpcObject(ISignalModel communicationModel);

    public IList<SignalData> GetGrpcObjects(IList<ISignalModel> communicationModels);
    public ISignalModel GetCommunicationModel(SignalData signalData);
    public SignalFilterModel? GetSignalFilters(SignalFilter? filters);
}
