using AlarmService_RPC;
using AlarmService.Grpc.Mapper;
using AlarmService.Logic.Controllers.Alarm;
using Grpc.Core;

namespace AlarmService.Grpc.Views;

public class AlarmView : Alarms.AlarmsBase
{
  private readonly IAlarmController _controller;
  private readonly IAlarmMapper _mapper;

  public AlarmView(IAlarmController controller)
  {
    _controller = controller;
    _mapper = new AlarmMapper();
  }

  public override async Task<AlarmData> GetById(AlarmId request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _controller.GetById(request.Id));
  }

  public override async Task<GetByIdsResponse> GetByIds(GetByIdsRequest request, ServerCallContext context)
  {
    var response = new GetByIdsResponse();
    response.Data.AddRange(_mapper.GetGrpcObjects(await _controller.GetByIds(request.Ids)));
    return response;
  }

  public override async Task<AlarmData> Create(CreateAlarmRequest request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _controller.Create(_mapper.GetCommunicationModel(request.Alarm), request.AgreementUuid));
  }

  public override async Task<AlarmData> Update(UpdateAlarmRequest request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _controller.Update(_mapper.GetUpdateDictionary(request.Alarm)));
  }

  public override async Task<DeleteResponse> Delete(AlarmId request, ServerCallContext context)
  {
    return new DeleteResponse
    {
      Deleted = await _controller.Delete(request.Id),
      Id = request.Id
    };
  }
}
