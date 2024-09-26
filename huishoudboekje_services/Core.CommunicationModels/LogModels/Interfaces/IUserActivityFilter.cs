namespace Core.CommunicationModels.LogModels.Interfaces;

public interface IUserActivityFilter
{
  IList<IUserActivityEntityFilter>? EntityFilters { get; set; }
  IList<IUserActivityTypeFilter>? TypeFilters { get; set; }
}
