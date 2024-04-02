using System.Net.Http.Json;
using System.Text.Json;
using Core.CommunicationModels.ReportModels;
using Core.CommunicationModels.ReportModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Microsoft.Extensions.Configuration;
using UserApi.Producers.HttpModels;
using UserApi.Producers.Interfaces;

namespace UserApi.Producers;

public class MonthlyReportHttpProducer(IConfiguration config) : IMonthlyReportProducer
{
  public async Task<IMonthlyReport> RequestMonthlyReport(long startDate, long endDate, string bsn)
  {
    string startDateAsString = DateTimeOffset.FromUnixTimeSeconds(startDate).DateTime.ToString("yyyy-MM-dd");
    string endDateAsString = DateTimeOffset.FromUnixTimeSeconds(endDate).DateTime.ToString("yyyy-MM-dd");
    string id = await GetCitizenId(bsn);
    MonthlyReportHttpItem report = await GetReport(id, startDateAsString, endDateAsString);
    int balance = await GetBalance(id, endDateAsString);
    return new MonthlyReport
    {
      StartDate = DateStringToUnix(report.start_datum),
      EndDate = DateStringToUnix(report.eind_datum),
      Total = DecimalStringToInt(report.totaal),
      TotalExpenses = DecimalStringToInt(report.totaal_uitgaven),
      TotalIncomes = DecimalStringToInt(report.totaal_inkomsten),
      Incomes = ConvertStatementSections(report.inkomsten),
      Expenses = ConvertStatementSections(report.uitgaven),
      Balance = balance
    };
  }
  private async Task<string> GetCitizenId(string bsn)
  {
    string id = "";
    using HttpClient client = new();
    HttpRequestMessage request = new()
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri(config["HHB_HUISHOUDBOEKJE_SERVICE"] + $"/burgers?filter_bsn={bsn}&columns=id"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      HttpProducerResponse<IList<GetIdHttpItem>>? responseObject = JsonSerializer.Deserialize<HttpProducerResponse<IList<GetIdHttpItem>>>(response);
      id = responseObject!.data[0].id.ToString();
    }
    catch (HttpRequestException ex)
    {
      throw new HHBConnectionException(
        "Error during REST call to huishoudboekje service",
        "Something went wrong while getting data");
    }
    catch (JsonException ex)
    {
      throw new HHBDataException(
        "JSON Exception occured while parsing data",
        "Incorrect data received from huishoudboekjeservice");
    }
    if (string.IsNullOrEmpty(id))
    {
      throw new HHBDataException(
        "Executed request correctly but did not receive id",
        "No data received from huishoudboekjeservice");
    }
    return id;
  }

  private async Task<MonthlyReportHttpItem> GetReport(string id, string startDate, string endDate)
  {
    MonthlyReportHttpItem result = null;
    using var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Get,
      Content = JsonContent.Create(new { burger_ids = new List<int> { int.Parse(id) } }),
      RequestUri = new Uri(config["HHB_RAPPORTAGE_SERVICE"] + $"/rapportage?startDate={startDate}&endDate={endDate}"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      HttpProducerResponse<IList<MonthlyReportHttpItem>>? responseObject = JsonSerializer.Deserialize<HttpProducerResponse<IList<MonthlyReportHttpItem>>>(response);
      result = responseObject!.data[0];
    }
    catch (HttpRequestException ex)
    {
      throw new HHBConnectionException(
        "Error during REST call to rapportage service",
        "Something went wrong while getting data");
    }
    catch (JsonException ex)
    {
      throw new HHBDataException(
        "JSON Exception occured while parsing data",
        "Incorrect data received from rapportageservice");
    }
    if (result == null)
    {
      throw new HHBDataException(
        "Executed request correctly but did not receive any data",
        "No report received from rapportageservice");
    }
    return result;
  }

  private async Task<int> GetBalance(string id, string endDate)
  {
    int result = 0;
    using var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Get,
      Content = JsonContent.Create(new { burger_ids = new List<string> { id } }),
      RequestUri = new Uri(config["HHB_RAPPORTAGE_SERVICE"] + $"//saldo?date={endDate}"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      HttpProducerResponse<BalanceHttpItem> responseObject = JsonSerializer.Deserialize<HttpProducerResponse<BalanceHttpItem>>(response);
      return responseObject.data.saldo;
    }
    catch (HttpRequestException ex)
    {
      throw new HHBConnectionException(
        "Error during REST call to rapportage service",
        "Something went wrong while getting data");
    }
    catch (JsonException ex)
    {
      throw new HHBDataException(
        "JSON Exception occured while parsing data",
        "Incorrect data received from rapportageservice");
    }
  }

  private int DecimalStringToInt(string decimalString)
  {
    return (int)decimal.Parse(decimalString) * 100;
  }

  private long DateStringToUnix(string dateString)
  {
    DateTime date = DateTime.ParseExact(dateString, "yyyy-MM-dd", null);
    return new DateTimeOffset(date).ToUnixTimeSeconds();
  }

  private long DateTimeStringToUnix(string dateTimeString)
  {
    DateTime date = DateTime.Parse(dateTimeString);
    return new DateTimeOffset(date).ToUnixTimeSeconds();
  }

  private List<IStatementSection> ConvertStatementSections(IList<StatementSectionHttpItem> list)
  {
    List<IStatementSection> result = [];
    foreach (StatementSectionHttpItem row in list)
    {
      StatementSection section = new()
      {
        StatementName = row.rubriek,
        Transactions = new List<IReportTransaction>()
      };
      foreach (ReportTransactionHttpItem transaction in row.transacties)
      {
        section.Transactions.Add(
          new ReportTransaction
        {
          TransactionDate = DateTimeStringToUnix(transaction.transactie_datum),
          AccountHolder = transaction.rekeninghouder,
          Amount = DecimalStringToInt(transaction.bedrag)
        });
      }
      result.Add(section);
    }
    return result;
  }
}
