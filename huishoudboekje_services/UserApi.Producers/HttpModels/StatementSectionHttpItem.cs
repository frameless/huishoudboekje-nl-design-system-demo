namespace UserApi.Producers.HttpModels;

public class StatementSectionHttpItem
{
  public string rubriek { get; set; }
  public IList<ReportTransactionHttpItem> transacties { get; set; }
}
