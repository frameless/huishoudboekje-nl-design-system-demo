using Core.CommunicationModels.LogModels.Interfaces;

namespace Core.CommunicationModels.LogModels;

public class UserActivityTypeFilter : IUserActivityTypeFilter
{
  public int? Id { get; set; }
}
