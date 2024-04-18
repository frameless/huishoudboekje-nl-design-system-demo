using AlarmService.Domain.Contexts;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Domain.Mappers.Interfaces;

public interface IAlarmMapper
{
  public Alarm GetDatabaseObject(IAlarmModel communicationModel);

  public IAlarmModel GetCommunicationModel(Alarm databaseObject);

  public IList<IAlarmModel> GetCommunicationModels(IList<Alarm> databaseObjects);

  public IList<Alarm> GetDatabaseObjects(IList<IAlarmModel> communicationModels);
}
