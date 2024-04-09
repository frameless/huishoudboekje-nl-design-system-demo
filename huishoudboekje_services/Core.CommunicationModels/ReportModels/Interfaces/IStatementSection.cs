namespace Core.CommunicationModels.ReportModels.Interfaces;

public interface IStatementSection
{
  public string StatementName { get; }
  public IList<IReportTransaction> Transactions { get; }
}
