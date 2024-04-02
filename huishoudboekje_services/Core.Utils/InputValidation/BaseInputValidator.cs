namespace Core.utils.InputValidation;

public abstract class BaseInputValidator<T>(string modelDisplayName)
{
  public void IsValid(T model)
  {
    if (!CheckModel(model))
    {
      throw new IncorrectInputException($"Incorrect {modelDisplayName} provided");
    }
  }

  public void IsValid(string uuid)
  {
    if (!ValidUuid(uuid))
    {
      throw new IncorrectInputException("Incorrect id provided");
    }
  }

  protected abstract bool CheckModel(T input);

  protected bool CheckValidTimestamp(long first)
  {
    try
    {
      DateTimeOffset.FromUnixTimeSeconds(first);
      return true;
    }
    catch (ArgumentOutOfRangeException)
    {
      return false;
    }
  }

  protected bool CheckNotInPast(long timestamp)
  {
    return DateTimeOffset.Now.ToUnixTimeSeconds() < timestamp;
  }

  protected bool CheckAfterDate(long checkDate, long date)
  {
    return checkDate > date;
  }

  private bool ValidUuid(string uuid)
  {
    try
    {
      Guid.Parse(uuid);
      return true;
    }
    catch (FormatException)
    {
      return false;
    }
  }
}
