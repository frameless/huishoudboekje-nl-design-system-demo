using Core.CommunicationModels.ReportModels.Interfaces;

namespace Core.CommunicationModels.ReportModels;

public class MonthlyReport : IMonthlyReport
{
  public long StartDate { get; set; }
  public long EndDate { get; set; }
  public int Total { get; set; }
  public int TotalExpenses { get; set; }
  public int TotalIncomes { get; set; }
  public IList<IStatementSection> Incomes { get; set; }
  public IList<IStatementSection> Expenses { get; set; }
  public int Balance { get; set; }
}
