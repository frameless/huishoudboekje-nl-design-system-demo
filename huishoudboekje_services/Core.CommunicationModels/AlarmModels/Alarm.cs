using Core.CommunicationModels.AlarmModels.Interfaces;

namespace Core.CommunicationModels.AlarmModels;

public class AlarmModel : IAlarmModel
{
  public string UUID { get; set; }

  public bool IsActive { get; set; }

  public int DateMargin { get; set; }

  public int Amount { get; set; }

  public int AmountMargin { get; set; }

  public IList<int>? RecurringMonths { get; set; }

  public IList<int>? RecurringDayOfMonth { get; set; }

  public IList<int>? RecurringDay { get; set; }

  public long? CheckOnDate { get; set; }

  public long StartDate { get; set; }

  public long? EndDate { get; set; }

  public int AlarmType { get; set; }

}
