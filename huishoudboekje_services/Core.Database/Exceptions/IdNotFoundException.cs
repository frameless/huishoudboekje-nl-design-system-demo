namespace Core.Database.Exceptions;

[Serializable]
public class IdNotFoundException : Exception
{
    public IdNotFoundException() : base()
    {
    }

    public IdNotFoundException(string message) : base(message)
    {
    }

    public IdNotFoundException(string message, Exception inner) : base(message, inner)
    {
    }
}