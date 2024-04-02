using AlarmService_RPC;
using AlarmService.Grpc.Mapper;
using AlarmService.Logic.Controllers.Signal;
using Core.CommunicationModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;
using Grpc.Core;

namespace AlarmService.Grpc.Views;

public class SignalView : Signals.SignalsBase
{
  private readonly ISignalController _controller;
  private readonly ISignalMapper _mapper;

  public SignalView(ISignalController controller)
  {
    _controller = controller;
    _mapper = new SignalMapper();
  }

  public override async Task<SignalsPagedResponse> GetPaged(SignalsPagedRequest request, ServerCallContext context)
  {
    Pagination page = new(request.Page.Take, request.Page.Skip);
    Paged<ISignalModel> signals = await _controller.GetItemsPaged(page, _mapper.GetSignalFilters(request.Filter));

    SignalsPagedResponse response = new SignalsPagedResponse();
    response.Data.AddRange(_mapper.GetGrpcObjects(signals.Data));
    response.PageInfo = new PaginationResponse
    {
      Skip = page.Skip,
      Take = page.Take,
      TotalCount = signals.TotalCount
    };
    return response;
  }

  public override async Task<SignalData> SetIsActive(SetIsActiveRequest request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _controller.SetIsActive(request.Id, request.IsActive));
  }

  public override async Task<SignalsResponse> GetAll(SignalsRequest request, ServerCallContext context)
  {
    var response = new SignalsResponse();
    response.Data.AddRange(_mapper.GetGrpcObjects(await _controller.GetAll(false)));
    return response;
  }

  public override async Task<GetActiveSignalsCountResponse> GetActiveSignalsCount(SignalsRequest request, ServerCallContext context)
  {
    return new GetActiveSignalsCountResponse
    {
      Count = await _controller.GetActiveSignalsCount()
    };
  }
}
