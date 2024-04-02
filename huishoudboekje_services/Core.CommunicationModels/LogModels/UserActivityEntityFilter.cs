using Core.CommunicationModels.LogModels.Interfaces;

namespace Core.CommunicationModels.LogModels;

public class UserActivityEntityFilter : IUserActivityEntityFilter
{
    public string EntityType { get; set; }
    public IList<string> EntityIds { get; set; }
}
