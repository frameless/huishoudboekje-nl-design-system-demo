using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using AlarmService.Logic.Producers;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DataTypes;
using Grpc.Core;
using Microsoft.Extensions.Configuration;

namespace AlarmService.MessageQueue.Producers;

// This is a class only used while transactions & journalentries are NOT in their new architecture. This should be a regular producer later
public class CheckAlarmHttpProducer(IConfiguration config) : ICheckAlarmProducer
{
  private string DATETIME_FORMAT = "yyyy-MM-dd";

  public async Task<Dictionary<string, IList<IJournalEntryModel>>> RequestJournalEntriesForAgreementAndPeriod(
    IList<string> agreementIds,
    DateRange dateRange)
  {
    Dictionary<string, IList<IJournalEntryModel>> result = new Dictionary<string, IList<IJournalEntryModel>>();
    string? rapportageUrl = config["HHB_RAPPORTAGE_SERVICE"];
    using (var client = new HttpClient())
    {
      var request = new HttpRequestMessage()
      {
        Method = HttpMethod.Get,

        RequestUri = new Uri(
          $"{rapportageUrl}/transactions?startDate={dateRange.From.ToString(DATETIME_FORMAT)}&endDate={dateRange.To.ToString(DATETIME_FORMAT)}"),
      };
      request.Content = JsonContent.Create(new { agreement_uuids = agreementIds });
      try
      {
        string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
        result = DeserializeResponseData(response);
      }
      catch (HttpRequestException ex)
      {
        throw new HHBConnectionException(
          "Error during REST call to rapportage service",
          "Something went wrong while getting data",
          ex,
          StatusCode.Unknown);
      }
      catch (JsonException ex)
      {
        throw new HHBDataException(
          "JSON Exception occured while parsing data",
          "Incorrect data received from rapportageservice",
          ex,
          StatusCode.Internal);
      }
    }

    return result;
  }

  public async Task<Dictionary<string, int>> RequestCitizenSaldos(IList<string> citizenUuids)
  {
    Dictionary<string, int> result = new Dictionary<string, int>();
    using (var client = new HttpClient())
    {
      HttpRequestMessage request = new HttpRequestMessage()
      {
        Method = HttpMethod.Get,
        RequestUri = new Uri(
          $"{config["HHB_RAPPORTAGE_SERVICE"]}/saldo?date={DateTime.UtcNow.ToString(DATETIME_FORMAT)}"),
      };
      request.Content = JsonContent.Create(new { citizen_uuids = citizenUuids });
      try
      {
        string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
        SaldoList saldos = JsonSerializer.Deserialize<SaldoList>(response);
        foreach (var saldo in saldos.data)
        {
          result.Add(saldo.uuid, saldo.saldo);
        }
        return result;
      }
      catch (HttpRequestException ex)
      {
        throw new HHBConnectionException(
          "Error during REST call to rapportage service",
          "Something went wrong while getting data",
          ex,
          StatusCode.Unknown);
      }
      catch (JsonException ex)
      {
        throw new HHBDataException(
          "JSON Exception occured while parsing data",
          "Incorrect data received from rapportageservice",
          ex,
          StatusCode.Internal);
      }
    }
  }

  public async Task<IDictionary<string, IDictionary<string, string>>> RequestCitizensForAlarms(IList<string> alarmIds)
  {
    using (var client = new HttpClient())
    {
      HttpRequestMessage request = new HttpRequestMessage()
      {
        Method = HttpMethod.Get,
        RequestUri = new Uri(
          $"{config["HHB_RAPPORTAGE_SERVICE"]}/citizens"),
      };
      request.Content = JsonContent.Create(new { alarm_ids = alarmIds });

        string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
        List<citizen_alarm_agreement> deserializedList = JsonSerializer.Deserialize<List<citizen_alarm_agreement>>(response);
        IDictionary<string, IDictionary<string, string>> result = new Dictionary<string, IDictionary<string, string>>();
        foreach (var data in deserializedList)
        {
          IDictionary<string, string> entry = new Dictionary<string, string>();
          entry["agreement"] = data.agreement;
          entry["citizen"] = data.citizen;
          result[data.alarm] = entry;
        }
        return result;
    }
  }
  public async Task<bool> UpdateAlarmUuidAgreement(string alarmUuid, string agreementUuid)
  {
    if (alarmUuid == "" || agreementUuid == "")
    {
      return false;
    }
    using HttpClient client = new HttpClient();
    try
    {
      HttpRequestMessage getIdRequest = new HttpRequestMessage
      {
        Method = HttpMethod.Get,
        RequestUri = new Uri($"{config["HHB_HUISHOUDBOEKJE_SERVICE"]}/afspraken?filter_uuid={agreementUuid}&columns=id")
      };
      string getIdResponse = await client.SendAsync(getIdRequest).Result.Content.ReadAsStringAsync();
      IdList idList = JsonSerializer.Deserialize<IdList>(getIdResponse);
      if (idList.data.Count != 1)
      {
        throw new Exception("Something went wrong getting the agreement id");
      }

      HttpRequestMessage postUpdateAgreementWithAlarmUuid = new HttpRequestMessage()
      {
        Method = HttpMethod.Post,
        RequestUri = new Uri($"{config["HHB_HUISHOUDBOEKJE_SERVICE"]}/afspraken/{idList.data[0].id}"),
        Content = JsonContent.Create(new { alarm_uuid = alarmUuid, alarm_id = alarmUuid })
      };
        HttpResponseMessage postResult = client.SendAsync(postUpdateAgreementWithAlarmUuid).Result;
        return postResult.StatusCode is HttpStatusCode.Created or HttpStatusCode.OK;
    }
    catch (Exception ex)
    {
      // TODO: Logging
      Console.Write(ex);
      return false;
    }
  }

  private IJournalEntryModel TransactionToJournalEntryModel(Transaction transaction, string agreementUUID)
  {
    return new JournalEntryModel()
    {
      Amount = transaction.bedrag,
      Date = ((DateTimeOffset)transaction.transactie_datum).ToUnixTimeSeconds(),
      AgreementUuid = agreementUUID,
      BankTransactionUuid = transaction.uuid,
      UUID = transaction.journalentry_uuid
    };
  }

  private Dictionary<string, IList<IJournalEntryModel>> DeserializeResponseData(string response)
  {
    Dictionary<string, IList<IJournalEntryModel>> result = new Dictionary<string, IList<IJournalEntryModel>>();
    RootObject transactions = JsonSerializer.Deserialize<RootObject>(response);
    foreach (var data in transactions.data)
    {
      string uuid = data.uuid;
      result[uuid] = new List<IJournalEntryModel>();
      foreach (Transaction transaction in data.transactions)
      {
        result[uuid].Add(TransactionToJournalEntryModel(transaction, uuid));
      }
    }

    return result;
  }

  internal struct citizen_alarm_agreement
  {
    public string agreement { get; set; }
    public string alarm { get; set; }
    public string citizen { get; set; }
  }

  internal struct AlarmBurgerList
  {
    public List<KeyValuePair<string, string>> data { get; set; }
  }

  internal struct IdList
  {
    public List<Id> data { get; set; }
  }

  internal struct Id
  {
    public int id { get; set; }
  }

  internal struct SaldoList
  {
    public List<Saldo> data { get; set; }
  }

  internal struct Saldo
  {
    public int saldo { get; set; }
    public string uuid { get; set; }
  }

  internal struct Transaction
  {
    public int bedrag { get; set; }

    public int customer_statement_message_id { get; set; }

    public int id { get; set; }
    public string uuid { get; set; }

    public string information_to_account_owner { get; set; }

    public bool is_geboekt { get; set; }

    public string statement_line { get; set; }

    public string tegen_rekening { get; set; }
    public string journalentry_uuid { get; set; }

    public DateTime transactie_datum { get; set; }
  }

  internal struct Data
  {
    public string uuid { get; set; }

    public List<Transaction> transactions { get; set; }
  }

  internal struct RootObject
  {
    public List<Data> data { get; set; }
  }
}
