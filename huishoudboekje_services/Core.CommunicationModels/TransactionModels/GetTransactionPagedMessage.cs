namespace Core.CommunicationModels.TransactionModels;

public class GetTransactionPagedMessage
{
  public Pagination Pagination { get; set; }
  public TransactionsFilter? Filter { get; set; }
}
