namespace Core.CommunicationModels.ReportModels.Interfaces;

public interface IReportTransaction
{
  public int Amount { get; }
  public long TransactionDate { get; }
  public string AccountHolder { get; }
}
