namespace Core.utils.DateTimeProvider;

public interface IDateTimeProvider
{
  public DateTime Now();
  public DateTime Today();
  public long UnixNow();
  public long UnixToday();
  public DateTime UnixToDateTime(long unixtime);
  public long DateTimeToUnix(DateTime datetime);
  public DateTime DateToUtc(DateTime datetime);
  public DateTime DateAsUtc(DateTime datetime);
  public DateTime EndOfDay(DateTime datetime);
  public DateTime StartOfDay(DateTime datetime);
}
