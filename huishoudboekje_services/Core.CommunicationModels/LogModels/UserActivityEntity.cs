using Core.CommunicationModels.LogModels.Interfaces;

namespace Core.CommunicationModels.LogModels;

public class UserActivityEntity : IUserActivityEntity
{
    public string EntityId { get; set; }
    public string EntityType { get; set; }
}

