using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using LogService.Database.Repositories;

namespace LogService.Controllers.Controllers.UserActivities;

public class UserActivitiesController : IUserActivityController
{
    private IUserActivitiesRepository _repository;

    public UserActivitiesController(IUserActivitiesRepository userActivityRepository)
    {
        _repository = userActivityRepository;
    }

    // public async Task<IUserActivityLog> GetById(string id)
    // {
    //     return await _repository.GetById(id);
    // }

    public async Task<Paged<IUserActivityLog>> GetItemsPaged(Pagination pagination, IUserActivityFilter filters)
    {
        return await _repository.GetPaged(pagination, filters);
    }

    public async Task<IList<IUserActivityLog>> GetMultipleById(IList<string> ids)
    {
        return await _repository.GetMultipleById(ids);
    }

    public async Task<IList<IUserActivityLog>> GetAllItems(IUserActivityFilter filters)
    {
        return await _repository.GetAll(filters);
    }

    public async Task AddItem(IUserActivityLog userActivityLog)
    {
      if (userActivityLog.Type == 0)
       userActivityLog = SetType(userActivityLog);

      await _repository.Insert(userActivityLog);
    }


    private IUserActivityLog SetType(IUserActivityLog userActivity)
    {
      userActivity.Type = 1;

      if (userActivity.SnapshotAfter != null || userActivity.SnapshotBefore != null)
        userActivity.Type = 2;

      return userActivity;
    }
}
