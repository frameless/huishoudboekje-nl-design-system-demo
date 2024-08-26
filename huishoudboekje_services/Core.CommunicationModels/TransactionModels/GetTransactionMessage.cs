namespace Core.CommunicationModels.TransactionModels;

public class GetTransactionMessage
{
  public TransactionsFilter? Filter { get; set; }
}
