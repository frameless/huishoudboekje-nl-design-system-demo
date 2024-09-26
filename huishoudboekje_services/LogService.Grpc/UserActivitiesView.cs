using Core.CommunicationModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Grpc.Core;
using LogService_RPC;
using LogService.Controllers.Controllers.UserActivities;
using LogService.Grpc.Utils;
using Microsoft.Extensions.Logging;

namespace LogService.Grpc;

public class UserActivitiesView : UserActivities.UserActivitiesBase
{
    private readonly ILogger<UserActivitiesView> _logger;
    private readonly IUserActivityController _controller;
    private readonly IUserActivityMapper _mapper;

    public UserActivitiesView(
        ILogger<UserActivitiesView> logger,
        IUserActivityController controller)
    {
        _logger = logger;
        _controller = controller;
        _mapper = new UserActivityMapper();
    }

    public override async Task<UserActivitiesResponse> GetUserActivities(
        UserActivitiesRequest request,
        ServerCallContext context)
    {
        IList<IUserActivityLog> userActivities = await _controller.GetAllItems(_mapper.GetUserActivityFilter(request.Filter));

        UserActivitiesResponse res = new();
        res.UserActivities.AddRange(_mapper.GetGrpcObjects(userActivities));

        return res;
    }

    public override async Task<UserActivitiesPagedResponse> GetUserActivitiesPaged(
        UserActivitiesPagedRequest request,
        ServerCallContext context)
    {
        Pagination page = new(request.Page.Take, request.Page.Skip);

        Paged<IUserActivityLog> userActivitiesPaged = await _controller.GetItemsPaged(page, _mapper.GetUserActivityFilter(request.Filter));

        UserActivitiesPagedResponse res = new();

        res.Data.AddRange(_mapper.GetGrpcObjects(userActivitiesPaged.Data));

        res.PageInfo = new PaginationResponse
        {
            Skip = page.Skip,
            Take = page.Take,
            TotalCount = userActivitiesPaged.TotalCount
        };

        return res;
    }

    // public override async Task<UserActivityData> GetUserActivity(
    //     UserActivityId request,
    //     ServerCallContext context)
    // {
    //     return _mapper.GetGrpcObject(await _controller.GetById(request.Id));
    // }
}
