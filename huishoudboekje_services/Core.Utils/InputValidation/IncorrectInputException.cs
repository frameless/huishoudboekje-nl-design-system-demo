namespace Core.utils.InputValidation;

[Serializable]
public class IncorrectInputException : Exception
{
  public IncorrectInputException() : base()
  {
  }

  public IncorrectInputException(string message) : base(message)
  {
  }

  public IncorrectInputException(string message, Exception inner) : base(message, inner)
  {
  }
}
