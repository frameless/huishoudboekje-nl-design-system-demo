using Core.CommunicationModels.ReportModels.Interfaces;

namespace Core.CommunicationModels.ReportModels;

public class StatementSection : IStatementSection
{
  public string StatementName { get; set; }
  public IList<IReportTransaction> Transactions { get; set; }
}
