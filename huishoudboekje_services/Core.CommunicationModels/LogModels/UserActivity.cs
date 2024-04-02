using Core.CommunicationModels.LogModels.Interfaces;

namespace Core.CommunicationModels.LogModels;

public class UserActivity : IUserActivityLog
{
    public string UUID { get; set; }
    public IList<IUserActivityEntity> Entities { get; set; }
    public string? UserId { get; set; }
    public string Action { get; set; }
    public long Timestamp { get; set; }
    public string? SnapshotBefore { get; set; }
    public string? SnapshotAfter { get; set; }
    public string Meta { get; set; }
}

