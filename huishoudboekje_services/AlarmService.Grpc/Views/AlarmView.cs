using AlarmService_RPC;
using AlarmService.Grpc.Mapper;
using AlarmService.Logic.Services.AlarmServices;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using Grpc.Core;

namespace AlarmService.Grpc.Views;

public class AlarmView : Alarms.AlarmsBase
{
  private readonly IAlarmService _service;
  private readonly IAlarmMapper _mapper;

  public AlarmView(IAlarmService service)
  {
    _service = service;
    _mapper = new AlarmMapper();
  }

  public override async Task<AlarmData> GetById(AlarmId request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _service.GetById(request.Id));
  }

  public override async Task<GetByIdsResponse> GetByIds(GetByIdsRequest request, ServerCallContext context)
  {
    var response = new GetByIdsResponse();
    response.Data.AddRange(_mapper.GetGrpcObjects(await _service.GetByIds(request.Ids)));
    return response;
  }

  public override async Task<AlarmData> Create(CreateAlarmRequest request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _service.Create(_mapper.GetCommunicationModel(request.Alarm), request.AgreementUuid));
  }

  public override async Task<AlarmData> Update(UpdateAlarmRequest request, ServerCallContext context)
  {
    return _mapper.GetGrpcObject(await _service.Update(_mapper.GetUpdateDictionary(request.Alarm)));
  }

  public override async Task<DeleteResponse> Delete(AlarmId request, ServerCallContext context)
  {
    return new DeleteResponse
    {
      Deleted = await _service.Delete(request.Id),
      Id = request.Id
    };
  }
}
