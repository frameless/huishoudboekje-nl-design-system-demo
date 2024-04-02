using AlarmService.Domain.Contexts;
using Core.CommunicationModels;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Domain.Mappers.Interfaces;

public interface ISignalMapper
{
  public Signal GetDatabaseObject(ISignalModel communicationModel);
  public IList<Signal> GetDatabaseObjects(IList<ISignalModel> communicationModel);

  public ISignalModel GetCommunicationModel(Signal databaseObject);
  public IList<ISignalModel> GetCommunicationModels(IList<Signal> databaseObjects);

  public Paged<ISignalModel> GetPagedCommunicationModels(Paged<Signal> paged);
}
