using Core.CommunicationModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using LinqKit;
using LogService.Database.Commands;
using LogService.Database.Contexts;
using LogService.Database.Mappers;

namespace LogService.Database.Repositories;

public class UserActivitiesRepository : BaseRepository<UserActivities>, IUserActivitiesRepository
{
  private readonly UserActivityMapper _mapper;

  public UserActivitiesRepository(LogServiceContext dbContext) : base(dbContext)
  {
    _mapper = new UserActivityMapper();
  }

  public async Task Insert(IUserActivityLog value)
  {
    await ExecuteCommand(new InsertRecordCommand<UserActivities>(_mapper.GetDatabaseObject(value)));
    await SaveChangesAsync();
  }

  public async Task<IList<IUserActivityLog>> GetMultipleById(IList<string> ids)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        new GetMultipleByIdCommand<UserActivities>(activity => ids.Contains(activity.Uuid.ToString()))));
  }

  public async Task<Paged<IUserActivityLog>> GetPaged(Pagination pagination, IUserActivityFilter filters)
  {
    var orderCommand = new OrderByCommandDecorator<UserActivities>(
      HasFilters(filters) ? DecorateFilters(new GetAllUserActivities(), filters) : new GetAllUserActivities(),
      x => x.Timestamp,
      desc: true);
    PagedCommandDecorator<UserActivities> pagedCommand = new(orderCommand, pagination);
    return _mapper.GetPagedCommunicationModels(await ExecuteCommand(pagedCommand));
  }

  public async Task<IList<IUserActivityLog>> GetAll(IUserActivityFilter filters)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        HasFilters(filters) ? DecorateFilters(new GetAllUserActivities(), filters) : new GetAllUserActivities()));
  }

  private IDatabaseDecoratableCommand<UserActivities> DecorateFilters(
    IDatabaseDecoratableCommand<UserActivities> command,
    IUserActivityFilter filters)
  {
    ExpressionStarter<UserActivities>? predicate = PredicateBuilder.New<UserActivities>(false);
    if (filters.EntityFilters?.Count > 0)
    {
      foreach (var entityFilter in filters.EntityFilters)
      {
        predicate = predicate.Or(
          userActivities =>
            userActivities.Entities.Any(
              entity => entity.EntityType.Equals(entityFilter.EntityType) &&
                        entityFilter.EntityIds.Contains(entity.EntityId)));
      }
    }

    if (filters.TypeFilters?.Count > 0)
    {
        List<int?> types = filters.TypeFilters.Select(filter => filter.Id).ToList();
        predicate.And(activity => types.Contains(activity.Type));
    }

    return new WhereCommandDecorator<UserActivities>(command, predicate);
  }

  private bool HasFilters(IUserActivityFilter filters)
  {
    return filters.EntityFilters?.Count > 0 ||
           filters.TypeFilters?.Count > 0;
  }
}
