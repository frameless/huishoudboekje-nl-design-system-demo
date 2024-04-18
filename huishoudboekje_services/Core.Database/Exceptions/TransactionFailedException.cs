namespace Core.Database.Exceptions;

[Serializable]
public class TransactionFailedException : Exception
{
    public TransactionFailedException() : base()
    {
    }

    public TransactionFailedException(string message) : base(message)
    {
    }

    public TransactionFailedException(string message, Exception inner) : base(message, inner)
    {
    }
}
