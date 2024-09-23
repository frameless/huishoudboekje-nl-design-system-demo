namespace Core.CommunicationModels.TransactionModels;

public class TransactionsFilter
{
  public IList<string>? CustomerStatementMessageUuids { get; set; }
  public IList<string>? Ibans { get; set; }
  public IList<string>? Ids { get; set; }
  public IList<string>? Exclude { get; set; }
  public IList<string>? KeyWords { get; set; }
  public int? MinAmount { get; set; }
  public int? MaxAmount { get; set; }
  public long? StartDate { get; set; }
  public long? EndDate { get; set; }
  public bool? IsReconciled { get; set; }
  public bool? IsCredit { get; set; }
}
