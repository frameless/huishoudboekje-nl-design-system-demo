namespace UserApi.Producers.HttpModels;

public class MonthlyReportHttpItem
{
  public int burger_id { get; set; }
  public string start_datum { get; set; }
  public string eind_datum { get; set; }
  public string totaal { get; set; }
  public string totaal_uitgaven { get; set; }
  public string totaal_inkomsten { get; set; }
  public IList<StatementSectionHttpItem> inkomsten { get; set; }
  public IList<StatementSectionHttpItem> uitgaven { get; set; }
}

