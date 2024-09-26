using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using LogService_RPC;

namespace LogService.Grpc.Utils;

public interface IUserActivityMapper
{
    public UserActivityData GetGrpcObject(IUserActivityLog communicationModel);
    public IList<UserActivityData> GetGrpcObjects(IList<IUserActivityLog> communicationModels);
    public IUserActivityFilter GetUserActivityFilter(Filter? filter);
}
