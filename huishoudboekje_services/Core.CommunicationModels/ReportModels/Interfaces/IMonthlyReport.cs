namespace Core.CommunicationModels.ReportModels.Interfaces;

public interface IMonthlyReport
{
  public long StartDate { get; }
  public long EndDate { get; }
  public int Total { get; }
  public int TotalExpenses { get; }
  public int TotalIncomes { get; }
  public IList<IStatementSection> Incomes { get; }
  public IList<IStatementSection> Expenses { get; }
  public int Balance { get; }
}
