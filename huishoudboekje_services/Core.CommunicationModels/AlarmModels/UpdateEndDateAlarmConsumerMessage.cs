namespace Core.CommunicationModels.AlarmModels;

public class UpdateEndDateAlarmConsumerMessage
{
  public string AlarmUuid { get; set; }
  public long EndDateUnix { get; set; }
}
