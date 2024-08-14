using AlarmService_RPC;
using AlarmService.Grpc.Mapper;
using AlarmService.Logic.Services.SignalServices;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;
using Grpc.Core;

namespace AlarmService.Grpc.Views;

public class SignalView : Signals.SignalsBase
{
  private readonly ISignalService _service;
  private readonly ISignalMapper _mapper;

  public SignalView(ISignalService service)
  {
    _service = service;
    _mapper = new SignalMapper();
  }

  public override async Task<SignalsPagedResponse> GetPaged(SignalsPagedRequest request, ServerCallContext context)
  {
    Pagination page = new(request.Page.Take, request.Page.Skip);
    Paged<ISignalModel> signals = await _service.GetItemsPaged(page, _mapper.GetSignalFilters(request.Filter));

    SignalsPagedResponse response = new();
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
    return _mapper.GetGrpcObject(await _service.SetIsActive(request.Id, request.IsActive));
  }

  public override async Task<SignalsResponse> GetAll(SignalsRequest request, ServerCallContext context)
  {
    var response = new SignalsResponse();
    response.Data.AddRange(_mapper.GetGrpcObjects(await _service.GetAll(false, null)));
    return response;
  }

  public override async Task<GetActiveSignalsCountResponse> GetActiveSignalsCount(SignalsRequest request, ServerCallContext context)
  {
    return new GetActiveSignalsCountResponse
    {
      Count = await _service.GetActiveSignalsCount()
    };
  }
}
