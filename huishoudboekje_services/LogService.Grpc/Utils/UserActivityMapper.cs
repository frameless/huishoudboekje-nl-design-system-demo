using System.Text.Json;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.utils.JsonConverters;
using LogService_RPC;

namespace LogService.Grpc.Utils;

public class UserActivityMapper : IUserActivityMapper
{
  private readonly JsonSerializerOptions _jsonSerializerOptions = new()
  {
    PropertyNameCaseInsensitive = true,
    Converters = { new NumberToStringJsonConverter() }
  };

  public UserActivityData GetGrpcObject(IUserActivityLog communicationModel)
  {
    var result = new UserActivityData();
    result.Id = communicationModel.UUID;
    result.Action = communicationModel.Action;

    var entities = new List<Entity>();
    foreach (var entity in communicationModel.Entities)
    {
      entities.Add(
        new Entity()
        {
          EntityId = entity.EntityId,
          EntityType = entity.EntityType
        });
    }

    result.Entities.AddRange(entities);
    if (communicationModel.UserId != null)
    {
      result.User = communicationModel.UserId;
    }

    result.Timestamp = communicationModel.Timestamp;
    result.Meta = JsonSerializer.Deserialize<Meta>(
      PrepareJsonForDeserialization(communicationModel.Meta),
      _jsonSerializerOptions);
    return result;
  }

  public IList<UserActivityData> GetGrpcObjects(IList<IUserActivityLog> communicationModels)
  {
    return communicationModels.Select(GetGrpcObject).ToList();
  }

  public IUserActivityFilter GetUserActivityFilter(Filter? filter)
  {
    IUserActivityFilter resultFilter = new UserActivityFilter();
    if (filter != null)
    {
      resultFilter.EntityFilters = GetUserActivityEntityFilters(filter);
      resultFilter.TypeFilters = GetUserActivityTypeFilter(filter);
    }

    return resultFilter;
  }

  private string PrepareJsonForDeserialization(string json)
  {
    return json.Trim('"').Replace("'", "\"").Replace("user_agent", "userAgent");
  }

  private IList<IUserActivityEntityFilter>? GetUserActivityEntityFilters(Filter? filters)
  {
    if (filters == null)
      return null;

    List<IUserActivityEntityFilter> result = [];
    filters.EntityFilter.ToList().ForEach(
      filter =>
      {
        result.Add(
          new UserActivityEntityFilter()
          {
            EntityType = filter.EntityType,
            EntityIds = filter.EntityIds.ToList()
          });
      });

    return result;
  }

  private IList<IUserActivityTypeFilter>? GetUserActivityTypeFilter(Filter filters)
  {
    if (filters.ActivityTypeFilter == null)
      return null;

    IList<IUserActivityTypeFilter> result = [];
    filters.ActivityTypeFilter.ToList().ForEach(
      filter =>
      {
        result.Add(
          new UserActivityTypeFilter()
          {
            Id = filter.Id
          });
      });

    return result;
  }
}
