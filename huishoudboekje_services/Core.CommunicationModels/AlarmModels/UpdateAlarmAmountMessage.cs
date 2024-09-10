namespace Core.CommunicationModels.AlarmModels;

public class UpdateAlarmAmountMessage
{
  public string AlarmUuid { get; set; }
  public int Amount { get; set; }
}
