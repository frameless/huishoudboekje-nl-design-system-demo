using AlarmService_RPC;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Grpc.Mapper;

public class AlarmMapper : IAlarmMapper
{
  public AlarmData GetGrpcObject(IAlarmModel communicationModel)
  {
    AlarmData alarm = new AlarmData
    {
      Id = communicationModel.UUID,
      IsActive = communicationModel.IsActive,
      DateMargin = communicationModel.DateMargin,
      Amount = communicationModel.Amount,
      AmountMargin = communicationModel.AmountMargin,
      StartDate = communicationModel.StartDate,
      AlarmType = communicationModel.AlarmType
    };
    if (communicationModel.RecurringMonths != null)
    {
      alarm.RecurringMonths.AddRange(communicationModel.RecurringMonths);
    }
    if (communicationModel.RecurringDayOfMonth != null)
    {
      alarm.RecurringDayOfMonth.AddRange(communicationModel.RecurringDayOfMonth);
    }
    if (communicationModel.RecurringDay != null)
    {
      alarm.RecurringDay.Add(communicationModel.RecurringDay);
    }
    if (communicationModel.EndDate != null)
    {
      alarm.EndDate = (long) communicationModel.EndDate;
    }
    if (communicationModel.CheckOnDate != null)
    {
      alarm.CheckOnDate = (long) communicationModel.CheckOnDate;
    }
    return alarm;
  }

  public IAlarmModel GetCommunicationModel(AlarmData alarmData)
  {
    AlarmModel alarm = new AlarmModel
    {
      UUID = alarmData.Id,
      IsActive = alarmData.IsActive,
      DateMargin = alarmData.DateMargin,
      Amount = alarmData.Amount,
      AmountMargin = alarmData.AmountMargin,
      StartDate = alarmData.StartDate,
      AlarmType = alarmData.AlarmType
    };
    if (alarmData.RecurringMonths != null)
    {
      alarm.RecurringMonths = alarmData.RecurringMonths.ToList();
    }
    if (alarmData.RecurringDayOfMonth != null)
    {
      alarm.RecurringDayOfMonth = alarmData.RecurringDayOfMonth.ToList();
    }
    if (alarmData.RecurringDay != null)
    {
      alarm.RecurringDay = alarmData.RecurringDay.ToList();
    }
    if (alarmData.HasEndDate)
    {
      alarm.EndDate = alarmData.EndDate;
    }
    if (alarmData.HasCheckOnDate)
    {
      alarm.CheckOnDate = alarmData.CheckOnDate;
    }
    return alarm;
  }

  public IList<AlarmData> GetGrpcObjects(IList<IAlarmModel> communicationModels)
  {
    return communicationModels.Select(GetGrpcObject).ToList();
  }

  public UpdateModel GetUpdateDictionary(AlarmUpdateData alarmData)
  {
    UpdateModel updateModel = new UpdateModel
    {
      Uuid = alarmData.Id,
      Updates = new Dictionary<string, object>()
    };
    if (alarmData.HasIsActive)
    {
      updateModel.Updates.Add(nameof(alarmData.IsActive), alarmData.IsActive);
    }
    if (alarmData.HasDateMargin)
    {
      updateModel.Updates.Add(nameof(alarmData.DateMargin), alarmData.DateMargin);
    }
    if (alarmData.HasAmount)
    {
      updateModel.Updates.Add(nameof(alarmData.Amount), alarmData.Amount);
    }
    if (alarmData.HasAmountMargin)
    {
      updateModel.Updates.Add(nameof(alarmData.AmountMargin), alarmData.AmountMargin);
    }
    if (alarmData.Recurring != null)
    {
      updateModel.Updates.Add(nameof(alarmData.Recurring.RecurringDay), alarmData.Recurring.RecurringDay);
      updateModel.Updates.Add(nameof(alarmData.Recurring.RecurringMonths), alarmData.Recurring.RecurringMonths);
      updateModel.Updates.Add(nameof(alarmData.Recurring.RecurringDayOfMonth), alarmData.Recurring.RecurringDayOfMonth);
    }
    if (alarmData.HasStartDate)
    {
      updateModel.Updates.Add(nameof(alarmData.StartDate), alarmData.StartDate);
    }
    if (alarmData.HasEndDate)
    {
      updateModel.Updates.Add(nameof(alarmData.EndDate), alarmData.EndDate);
    }
    if (alarmData.HasAlarmType)
    {
      updateModel.Updates.Add(nameof(alarmData.AlarmType), alarmData.AlarmType);
    }
    return updateModel;
  }
}
