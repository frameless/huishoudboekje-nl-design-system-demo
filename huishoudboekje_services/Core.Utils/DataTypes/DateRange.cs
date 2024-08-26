namespace Core.utils.DataTypes;

public class DateRange
{
  public DateTime From { get; set; }
  public DateTime To { get; set; }

  public DateRange()
  {
  }

  public DateRange(DateTime from, DateTime to)
  {
    From = from;
    To = to;
  }

  public IList<DateTime> GetDatesInRange()
  {
    return Enumerable.Range(0, 1 + To.Subtract(From).Days)
      .Select(offset => From.AddDays(offset))
      .ToList();
  }
}
