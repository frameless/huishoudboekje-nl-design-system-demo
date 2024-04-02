namespace Core.utils.DateTimeProvider;

public class DateTimeProvider : IDateTimeProvider
{
  /// <summary>
  /// Returns a <see cref="DateTime"/> in UTC of the current moment
  /// </summary>
  /// <returns><see cref="DateTime"/> in UTC</returns>
  public DateTime Now()
  {
    return DateTime.UtcNow;
  }

  /// <summary>
  /// Returns a <see cref="DateTime"/> in UTC of the current day (00:00:00 time)
  /// </summary>
  /// <returns>Today at 00:00:00 as a <see cref="DateTime"/> in UTC</returns>
  public DateTime Today()
  {
    return DateTime.UtcNow.Date;
  }

  /// <summary>
  /// Returns a <see cref="long"/> unixtimeseconds in UTC of the current moment
  /// </summary>
  /// <returns><see cref="long"/> unixtimeseconds in UTC</returns>
  public long UnixNow()
  {
    return DateTimeToUnix(Now());
  }

  /// <summary>
  /// Returns a <see cref="long"/> unixtimeseconds in UTC of the current day (00:00:00 time)
  /// </summary>
  /// <returns>Today at 00:00:00 as a <see cref="long"/> unixtimeseconds in UTC</returns>
  public long UnixToday()
  {
    return DateTimeToUnix(Today());
  }

  /// <summary>
  /// Convert a unixtimeseconds <see cref="long"/> to <see cref="DateTime"/> in UTC
  /// </summary>
  /// <param name="unixtime">unixtime in seconds to convert</param>
  /// <returns>The UTC <see cref="DateTime"/> represented by <paramref name="unixtime"/></returns>
  public DateTime UnixToDateTime(long unixtime)
  {
    return DateTimeOffset.FromUnixTimeSeconds(unixtime).UtcDateTime;
  }

  /// <summary>
  /// Convert a <see cref="DateTime"/> to unixtimeseconds <see cref="long"/>
  /// </summary>
  /// <param name="datetime"><see cref="DateTime"/>to convert</param>
  /// <returns>The unixtime <see cref="DateTime"/> represented by <paramref name="unixtime"/></returns>
  public long DateTimeToUnix(DateTime datetime)
  {
    return ((DateTimeOffset)datetime).ToUnixTimeSeconds();
  }

  /// <summary>
  /// Convert a <see cref="DateTime"/> to UTC
  /// </summary>
  /// <param name="datetime"></param>
  /// <returns>The UTC <see cref="DateTime"/></returns>
  public DateTime DateToUtc(DateTime datetime)
  {
    return datetime.ToUniversalTime();
  }

  /// <summary>
  /// Set the timezone of a datetime to UTC.
  /// WARNING - this does not convert a <see cref="DateTime"/> to UTC, but sets the <see cref="DateTimeKind"/> to UTC
  /// </summary>
  /// <param name="datetime">The <see cref="DateTime"/> to convert</param>
  /// <returns>The <see cref="DateTime"/> as a UTC kind DateTime</returns>
  public DateTime DateAsUtc(DateTime datetime)
  {
    return DateTime.SpecifyKind(datetime, DateTimeKind.Utc);
  }

  /// <summary>
  /// Returns the current Date at 23:59:59 UTC
  /// </summary>
  /// <param name="datetime"></param>
  /// <returns><see cref="DateTime"/> of the given day at 23:59:59 UTC</returns>
  public DateTime EndOfDay(DateTime datetime)
  {
    return new DateTime(datetime.Year, datetime.Month, datetime.Day, 23, 59, 59, DateTimeKind.Utc);
  }

  /// <summary>
  /// Returns the current Date at 00:00:00 UTC
  /// </summary>
  /// <param name="datetime"></param>
  /// <returns><see cref="DateTime"/> of the given day at 00:00:00 UTC</returns>
  public DateTime StartOfDay(DateTime datetime)
  {
    return new DateTime(datetime.Year, datetime.Month, datetime.Day, 0, 0, 0, DateTimeKind.Utc);
  }
}
