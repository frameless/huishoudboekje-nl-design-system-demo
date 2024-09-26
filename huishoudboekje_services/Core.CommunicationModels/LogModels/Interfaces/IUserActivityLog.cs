namespace Core.CommunicationModels.LogModels.Interfaces;

public interface IUserActivityLog
{
    string UUID { get; }
    IList<IUserActivityEntity> Entities { get; }
    string? UserId { get; }
    string Action { get; }
    long Timestamp { get; }
    string? SnapshotBefore { get; set; }
    string? SnapshotAfter { get; set; }
    string Meta { get; }
    int Type { get; set; }
}
