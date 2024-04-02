using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;

namespace LogService.Controllers.Controllers.UserActivities;

public interface IUserActivityController
{
    // public Task<IUserActivityLog> GetById(string id);

    public Task<IList<IUserActivityLog>> GetMultipleById(IList<string> ids);
    public Task AddItem(IUserActivityLog item);
    public Task<Paged<IUserActivityLog>> GetItemsPaged(Pagination pagination, IList<UserActivityEntityFilter>? filters);
    public Task<IList<IUserActivityLog>> GetAllItems(IList<UserActivityEntityFilter>? filters);
}
