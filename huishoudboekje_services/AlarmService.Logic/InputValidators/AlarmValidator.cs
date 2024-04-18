using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.utils.InputValidation;

namespace AlarmService.Logic.InputValidators;

public class AlarmValidator(string modelDisplayName = "alarm") : BaseInputValidator<IAlarmModel>(modelDisplayName)
{
  //TODO not sure if this is the best way to check alarm type
  private readonly List<int> alarmTypes = [1, 2, 3, 4]; //See AlarmService.Domain for types

  protected override bool CheckModel(IAlarmModel input)
  {
    return CheckDates(input) &&
           CheckAlarmType(input) &&
           CheckRecurringSettings(input);
  }

  private bool CheckRecurringSettings(IAlarmModel input)
  {
    if (alarmTypes.Any(type => input.AlarmType == type))
    {
      switch (input.AlarmType)
      {
        case 1 or 4:
          return input.RecurringMonths?.Count > 0 && input.RecurringDayOfMonth?.Count > 0 && input.RecurringDay?.Count == 0;
        case 2:
          return input.RecurringMonths?.Count == 0 && input.RecurringDayOfMonth?.Count == 0 && input.RecurringDay?.Count > 0;
        case 3:
          return input.RecurringMonths?.Count == 0 && input.RecurringDayOfMonth?.Count == 0 && input.RecurringDay?.Count == 0 && input.EndDate != null;
        default:
          return false;
      }
    }

    return false;
  }

  private bool CheckAlarmType(IAlarmModel input)
  {
    return input.AlarmType == 0 || alarmTypes.Contains(input.AlarmType);
  }

  private bool CheckDates(IAlarmModel input)
  {
    if (input.StartDate == 0 && (input.EndDate == null || input.EndDate == 0) || input.StartDate == input.EndDate)
    {
      return true;
    }

    if (input.EndDate == null || input.EndDate == 0)
    {
      return CheckValidTimestamp(input.StartDate);
    }
    return CheckValidTimestamp(input.StartDate)
           && CheckValidTimestamp((long) input.EndDate)
           && CheckAfterDate((long) input.EndDate, input.StartDate);
  }
}
