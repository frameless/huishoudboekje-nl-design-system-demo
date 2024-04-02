using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.Database.Utils;

namespace LogService.Database.Repositories;

public interface IUserActivitiesRepository
{
    public Task<IList<IUserActivityLog>> GetAll(IList<UserActivityEntityFilter>? filters);

    // public Task<IUserActivityLog> GetById(string id);

    public Task Insert(IUserActivityLog value);

    public Task<IList<IUserActivityLog>> GetMultipleById(IList<string> ids);

    public Task<Paged<IUserActivityLog>> GetPaged(Pagination pagination, IList<UserActivityEntityFilter>? filters);
}
