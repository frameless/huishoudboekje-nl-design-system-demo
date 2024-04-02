using System.Text.Json;
using AlarmService.Domain.Contexts;
using AlarmService.Domain.Mappers.Interfaces;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;

namespace AlarmService.Domain.Mappers;

public class AlarmMapper : IAlarmMapper
{
  public Alarm GetDatabaseObject(IAlarmModel communicationModel)
  {
    Alarm alarm = new Alarm
    {
      IsActive = communicationModel.IsActive,
      DateMargin = communicationModel.DateMargin,
      Amount = communicationModel.Amount,
      AmountMargin = communicationModel.AmountMargin,
      StartDate = communicationModel.StartDate,
      Type = communicationModel.AlarmType,
      CheckOnDate = communicationModel.CheckOnDate
    };
    if (communicationModel.UUID != "")
    {
      alarm.Uuid = Guid.Parse(communicationModel.UUID);
    }
    if (communicationModel.RecurringMonths != null)
    {
      alarm.RecurringMonths = JsonSerializer.Serialize(communicationModel.RecurringMonths);
    }
    if (communicationModel.RecurringDayOfMonth != null)
    {
      alarm.RecurringDayOfMonth = JsonSerializer.Serialize(communicationModel.RecurringDayOfMonth);
    }
    if (communicationModel.RecurringDay != null)
    {
      alarm.RecurringDay = JsonSerializer.Serialize(communicationModel.RecurringDay);
    }
    if (communicationModel.EndDate != null)
    {
      alarm.EndDate = communicationModel.EndDate;
    }

    return alarm;
  }

  public IList<Alarm> GetDatabaseObjects(IList<IAlarmModel> communicationModels)
  {
    return communicationModels.Select(GetDatabaseObject).ToList();
  }

  public IAlarmModel GetCommunicationModel(Alarm databaseObject)
  {
    AlarmModel alarm = new AlarmModel
    {
      UUID = databaseObject.Uuid.ToString(),
      IsActive = databaseObject.IsActive,
      DateMargin = databaseObject.DateMargin,
      Amount = databaseObject.Amount,
      AmountMargin = databaseObject.AmountMargin,
      StartDate = databaseObject.StartDate,
      AlarmType = databaseObject.Type
    };
    if (databaseObject.RecurringMonths != null)
    {
      alarm.RecurringMonths = JsonSerializer.Deserialize<IList<int>>(databaseObject.RecurringMonths);
    }
    if (databaseObject.RecurringDayOfMonth != null)
    {
      alarm.RecurringDayOfMonth = JsonSerializer.Deserialize<IList<int>>(databaseObject.RecurringDayOfMonth);
    }
    if (databaseObject.RecurringDay != null)
    {
      alarm.RecurringDay = JsonSerializer.Deserialize<IList<int>>(databaseObject.RecurringDay);
    }
    if (databaseObject.EndDate != null)
    {
      alarm.EndDate = databaseObject.EndDate.Value;
    }

    if (databaseObject.CheckOnDate != null)
    {
      alarm.CheckOnDate = databaseObject.CheckOnDate.Value;
    }
    return alarm;
  }

  public IList<IAlarmModel> GetCommunicationModels(IList<Alarm> databaseObjects)
  {
    return databaseObjects.Select(GetCommunicationModel).ToList();
  }
}
