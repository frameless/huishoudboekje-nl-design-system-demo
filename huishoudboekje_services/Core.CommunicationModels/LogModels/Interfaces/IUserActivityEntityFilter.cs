namespace Core.CommunicationModels.LogModels.Interfaces;

public interface IUserActivityEntityFilter
{
    public string EntityType { get; }
    public IList<string> EntityIds { get; }
}
