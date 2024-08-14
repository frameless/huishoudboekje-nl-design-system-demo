using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using Grpc.Core;

namespace AlarmService.Logic.Services.AlarmServices.QueryHandlers;

internal class CreateQueryHandler : IQueryHandler<Create, IAlarmModel>
{
  private readonly AlarmValidator _alarmValidator;
  private readonly IAlarmRepository _alarmRepository;
  private readonly ICheckAlarmProducer _alarmProducer;
  private readonly DateTimeProvider _dateTimeProvider;
  private readonly CheckOnDateHelper _checkOnDateHelper;

  public CreateQueryHandler(IAlarmRepository alarmRepository, ICheckAlarmProducer alarmProducer)
  {
  _alarmValidator = new AlarmValidator();
  _alarmRepository = alarmRepository;
  _alarmProducer = alarmProducer;
  _dateTimeProvider = new DateTimeProvider();
  _checkOnDateHelper = new CheckOnDateHelper(_dateTimeProvider);
  }


  public async Task<IAlarmModel> HandleAsync(Create query)
  {
    _alarmValidator.IsValid(query.Alarm);
    AlarmModel alarmData = (AlarmModel)query.Alarm;
    alarmData.CheckOnDate = _checkOnDateHelper.DetermineFirstCheckOnDate(
      _dateTimeProvider.UnixToDateTime(query.Alarm.StartDate),
      query.Alarm);
    IAlarmModel insertedAlarm = await _alarmRepository.InsertWithoutSave(alarmData);
    bool updatedSend = await _alarmProducer.UpdateAlarmUuidAgreement(insertedAlarm.UUID, query.AgreementId);
    if (!updatedSend)
    {
      throw new HHBConnectionException("Could not update Agreement therefore the Alarm is not created", "Failed to update agreement, alarm was not created", StatusCode.Aborted);
    }
    await _alarmRepository.SaveChanges();
    return insertedAlarm;
  }
}
