using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.Controllers.Signal;
using AlarmService.Logic.InputValidators;
using AlarmService.Logic.Misc;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Core.utils.DateTimeProvider;
using LinqKit;

namespace AlarmService.Logic.Controllers.Alarm;

public class AlarmController : IAlarmController
{
  private readonly AlarmValidator alarmValidator = new();
  private readonly IAlarmRepository alarmRepository;
  private readonly ISignalRepository signalRepository;
  private readonly ICheckAlarmProducer alarmProducer;
  private readonly EvaluationHelper evaluationHelper;
  private readonly IDateTimeProvider dateTimeProvider;

  public AlarmController(IAlarmRepository alarmRepository, ISignalRepository signalRepository, ICheckAlarmProducer alarmProducer, EvaluationHelper evaluationHelper, IDateTimeProvider dateTimeProvider)
  {
    this.alarmRepository = alarmRepository;
    this.signalRepository = signalRepository;
    this.alarmProducer = alarmProducer;
    this.evaluationHelper = evaluationHelper;
    this.dateTimeProvider = dateTimeProvider;
  }

  public Task<IAlarmModel> GetById(string id)
  {
    alarmValidator.IsValid(id);
    return alarmRepository.GetById(id);
  }

  public Task<IList<IAlarmModel>> GetByIds(IList<string> ids)
  {
    ids = ids.Where(id => !string.IsNullOrEmpty(id)).ToList();
    foreach (var id in ids)
    {
      alarmValidator.IsValid(id);
    }
    return alarmRepository.GetMultipleByIds(ids);
  }

  public async Task<IAlarmModel> Create(IAlarmModel alarm, string agreementUuid)
  {
    alarmValidator.IsValid(alarm);
    AlarmModel alarmData = (AlarmModel)alarm;
    alarmData.CheckOnDate = evaluationHelper.DetermineFirstCheckOnDate(
      dateTimeProvider.UnixToDateTime(alarm.StartDate),
      alarm);
    var insertedAlarm = await alarmRepository.InsertWithoutSave(alarmData);
    var updatedSend = await alarmProducer.UpdateAlarmUuidAgreement(insertedAlarm.UUID, agreementUuid);
    if (!updatedSend)
    {
      throw new HHBConnectionException("Could not update Agreement therefore the Alarm is not created", "Failed to update agreement, alarm was not created", StatusCode.Aborted);
    }
    await alarmRepository.SaveChanges();
    return insertedAlarm;
  }

  public Task<IAlarmModel> Update(UpdateModel alarm)
  {
    alarmValidator.IsValid(alarm.Uuid);
    //TODO validate rest
    return alarmRepository.Update(alarm);
  }

  public Task<bool> Delete(string id)
  {
    alarmValidator.IsValid(id);
    signalRepository.DeleteByAlarmIds([id]);
    return alarmRepository.Delete(id);
  }

  public Task<bool> DeleteByIds(IList<string> ids)
  {
    ids.ForEach(id => alarmValidator.IsValid(id));
    return alarmRepository.DeleteByIds(ids);
  }

  public Task<IList<IAlarmModel>> GetAllBeforeByCheckOnDateBefore(DateTime date)
  {
    return alarmRepository.GetAllByCheckOnDateBeforeNoTracking(date);
  }
}
