using Core.CommunicationModels.ReportModels.Interfaces;

namespace Core.CommunicationModels.ReportModels;

public class ReportTransaction : IReportTransaction
{
  public int Amount { get; set; }
  public long TransactionDate { get; set; }
  public string AccountHolder { get; set; }
}
