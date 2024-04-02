namespace Core.CommunicationModels.AlarmModels.Interfaces;

public interface IAlarmModel
{
  string UUID { get; }
  bool IsActive { get; }
  int DateMargin { get; }
  int Amount { get; }
  int AmountMargin { get; }
  IList<int>? RecurringMonths { get; }
  IList<int>? RecurringDayOfMonth { get; }
  IList<int>? RecurringDay { get; }
  long? CheckOnDate { get; }
  long StartDate { get; }
  long? EndDate { get; }
  int AlarmType { get; }



}
