using Core.CommunicationModels.LogModels.Interfaces;
using LogService.Database.Contexts;

namespace LogService.Database.Mappers;

public interface IUserActivityMapper
{
    public UserActivities GetDatabaseObject(IUserActivityLog communicationModel);

    public IUserActivityLog GetCommunicationModel(UserActivities databaseObject);
}
