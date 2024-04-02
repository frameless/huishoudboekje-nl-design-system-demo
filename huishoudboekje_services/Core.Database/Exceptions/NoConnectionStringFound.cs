namespace Core.Database.Exceptions;

[Serializable]
public class NoConnectionStringFound : Exception
{
    public NoConnectionStringFound() : base()
    {
    }

    public NoConnectionStringFound(string message) : base(message)
    {
    }

    public NoConnectionStringFound(string message, Exception inner) : base(message, inner)
    {
    }
}
