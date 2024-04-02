using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
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

  public async Task<Paged<IUserActivityLog>> GetPaged(Pagination pagination, IList<UserActivityEntityFilter>? filters)
  {
    var orderCommand = new OrderByCommandDecorator<UserActivities>(
      filters is { Count: > 0 } ? DecorateFilters(new GetAllUserActivities(), filters) : new GetAllUserActivities(),
      x => x.Timestamp,
      desc: true);
    PagedCommandDecorator<UserActivities> pagedCommand = new(orderCommand, pagination);
    return _mapper.GetPagedCommunicationModels(await ExecuteCommand(pagedCommand));
  }

  public async Task<IList<IUserActivityLog>> GetAll(IList<UserActivityEntityFilter>? filters)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        filters is { Count: > 0 } ? DecorateFilters(new GetAllUserActivities(), filters) : new GetAllUserActivities()));
  }

  private IDatabaseDecoratableCommand<UserActivities> DecorateFilters(
    IDatabaseDecoratableCommand<UserActivities> command,
    IList<UserActivityEntityFilter> filters)
  {
    var predicate = PredicateBuilder.New<UserActivities>(false);
    foreach (var filter in filters)
    {
        predicate = predicate.Or(userActivities =>
            userActivities.Entities.Any(entity => entity.EntityType.Equals(filter.EntityType) &&
                                                  filter.EntityIds.Contains(entity.EntityId)));
    }

    return new WhereCommandDecorator<UserActivities>(command, predicate);
  }
}
