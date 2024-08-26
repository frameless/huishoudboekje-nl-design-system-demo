namespace Core.CommunicationModels.TransactionModels;

public class UpdateIsReconciledMessage
{
  public IList<string>? Ids { get; set; }
  public bool IsReconciled { get; set; }
}
