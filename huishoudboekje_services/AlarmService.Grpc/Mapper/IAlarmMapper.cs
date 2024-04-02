using AlarmService_RPC;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Grpc.Mapper;

public interface IAlarmMapper
{
  public AlarmData GetGrpcObject(IAlarmModel communicationModel);
  public IAlarmModel GetCommunicationModel(AlarmData alarmData);
  public IList<AlarmData> GetGrpcObjects(IList<IAlarmModel> communicationModels);

  public UpdateModel GetUpdateDictionary(AlarmUpdateData alarmData);
}
