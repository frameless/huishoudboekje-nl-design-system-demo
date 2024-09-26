using Core.CommunicationModels.LogModels.Interfaces;

namespace Core.CommunicationModels.LogModels;

public class UserActivityFilter : IUserActivityFilter
{
  public IList<IUserActivityEntityFilter>? EntityFilters { get; set; }

  public IList<IUserActivityTypeFilter>? TypeFilters { get; set; }
}
