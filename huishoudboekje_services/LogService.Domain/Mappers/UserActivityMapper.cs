using System.Text.Json;
using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using LogService.Database.Contexts;

namespace LogService.Database.Mappers;

public class UserActivityMapper : IUserActivityMapper
{
    public UserActivities GetDatabaseObject(IUserActivityLog communicationModel)
    {
        var activities = new UserActivities
        {
            Timestamp = communicationModel.Timestamp,
            UserId = communicationModel.UserId,
            Action = communicationModel.Action,
            SnapshotBefore = communicationModel.SnapshotBefore,
            SnapshotAfter = communicationModel.SnapshotAfter,
            Meta = communicationModel.Meta,
            Entities = new List<UserActivityEntities>()
        };
        foreach (IUserActivityEntity entity in communicationModel.Entities)
        {
          activities.Entities.Add(new UserActivityEntities()
          {
            EntityId = entity.EntityId,
            EntityType = entity.EntityType
          });
        }
        return activities;
    }

    public IList<UserActivities> GetDatabaseObjects(IList<IUserActivityLog> communicationModels)
    {
        return communicationModels.Select(GetDatabaseObject).ToList();
    }

    public IUserActivityLog GetCommunicationModel(UserActivities databaseObject)
    {
        var activity = new UserActivity
        {
            Timestamp = databaseObject.Timestamp,
            UserId = databaseObject.UserId,
            Action = databaseObject.Action,
            Entities = new List<IUserActivityEntity>(),
            SnapshotBefore = databaseObject.SnapshotBefore,
            SnapshotAfter = databaseObject.SnapshotAfter,
            Meta = databaseObject.Meta,
            UUID = databaseObject.Uuid.ToString()
        };

        foreach (var entity in databaseObject.Entities)
        {
            activity.Entities.Add(new UserActivityEntity()
            {
                EntityId = entity.EntityId,
                EntityType = entity.EntityType
            });
        }
        return activity;
    }

    public IList<IUserActivityLog> GetCommunicationModels(IList<UserActivities> databaseObjects)
    {
        return databaseObjects.Select(GetCommunicationModel).ToList();
    }

    public Paged<IUserActivityLog> GetPagedCommunicationModels(Paged<UserActivities> paged)
    {
        return new Paged<IUserActivityLog>(
            paged.Data.Select(GetCommunicationModel).ToList(),
            paged.TotalCount);
    }
}
