using System.Net.Http.Json;
using System.Text.Json;
using BankServices.Logic.Producers;
using Core.CommunicationModels.AgreementModels;
using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using Grpc.Core;
using Microsoft.Extensions.Configuration;

namespace BankServices.MessageQueue.Producers;

public class PaymentRecordHttpProducer(IConfiguration config, IDateTimeProvider dateTimeProvider)
  : IPaymentRecordProducer
{
  private Dictionary<string, int> dayToNumer = new()
  {
    { "Monday", 1 }, { "Tuesday", 2 }, { "Wednesdag", 3 }, { "Thursday", 4 }, { "Friday", 5 }, { "Saturday", 6 },
    { "Sunday", 0 }
  };

  public async Task<IDictionary<IAgreement, IPaymentInstruction>> GetAgreementsWithPaymentInstruction(DateRange dateRange)
  {
    IDictionary<IAgreement, IPaymentInstruction> result = new Dictionary<IAgreement, IPaymentInstruction>();
    string hhbserviceUrl = config["HHB_HUISHOUDBOEKJE_SERVICE"];
    using (var client = new HttpClient())
    {
      var request = new HttpRequestMessage()
      {
        Method = HttpMethod.Get,

        RequestUri = new Uri($"{hhbserviceUrl}/afspraken/filter")
      };
      request.Content = JsonContent.Create(new { filter = new
      {
        payment_instructions = true,
        offset_account_info = true,
        start_date = dateTimeProvider.DateTimeToUnix(dateRange.From),
        end_date = dateTimeProvider.DateTimeToUnix(dateRange.To)
      } });
      try
      {
        string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
        result = DeserializeResponseData(response);
      }
      catch (HttpRequestException ex)
      {
        throw new HHBConnectionException(
          "Error during REST call to huishoudboekje service",
          "Something went wrong while getting data",
          ex,
          StatusCode.Unknown);
      }
      catch (JsonException ex)
      {
        throw new HHBDataException(
          "JSON Exception occured while parsing data",
          "Incorrect data received from huishoudboekje service",
          ex,
          StatusCode.Internal);
      }
    }

    return result;
  }

  private IDictionary<IAgreement, IPaymentInstruction> DeserializeResponseData(string response)
  {
    IDictionary<IAgreement, IPaymentInstruction> result = new Dictionary<IAgreement, IPaymentInstruction>();
    RootObject root = JsonSerializer.Deserialize<RootObject>(response);
    foreach (Afspraak afspraak in root.afspraken)
    {
      IAgreement agreement = new MinimalAgreement();
      agreement.Amount = afspraak.credit ? afspraak.bedrag : afspraak.bedrag * -1;
      agreement.OffsetAccount = new Account()
      {
        Iban = afspraak.offset_account_iban,
        Name = afspraak.offset_account_name
      };
      agreement.Description = afspraak.omschrijving;
      agreement.UUID = afspraak.uuid;

      IPaymentInstruction paymentInstruction = new PaymentInstruction();
      paymentInstruction.StartDate = dateTimeProvider.DateTimeToUnix(
        dateTimeProvider.DateAsUtc(DateTime.Parse(afspraak.betaalinstructie.start_date)));

      if (afspraak.betaalinstructie.end_date != null)
      {
        paymentInstruction.EndDate = dateTimeProvider.DateTimeToUnix(
          dateTimeProvider.DateAsUtc(DateTime.Parse(afspraak.betaalinstructie.end_date)));
        if (afspraak.betaalinstructie.end_date == afspraak.betaalinstructie.start_date)
        {
          paymentInstruction.Type = 1;
        }
      }


      if (afspraak.betaalinstructie.by_day != null)
      {
        List<int> byDay = new();
        {
          foreach (var day in afspraak.betaalinstructie.by_day)
          {
            byDay.Add(dayToNumer[day]);
          }
        }
        paymentInstruction.ByDay = byDay;
        if (byDay.Count > 0 && paymentInstruction.Type != 1)
        {
          paymentInstruction.Type = 2;
        }
      }

      if (afspraak.betaalinstructie.by_month != null)
      {
        paymentInstruction.ByMonth = afspraak.betaalinstructie.by_month;
        paymentInstruction.ByMonthDay = afspraak.betaalinstructie.by_month_day;
        if (paymentInstruction.Type is not (1 or 3))
        {
          paymentInstruction.Type = 2;
        }
      }
      result.Add(agreement, paymentInstruction);
    }

    return result;
  }

  public struct Betaalinstructie
  {
    public List<int>? by_month { get; set; }

    public List<int>? by_month_day { get; set; }

    public List<string>? by_day { get; set; }

    public string start_date { get; set; }

    public string? end_date { get; set; }
  }

  public struct Afspraak
  {
    public int bedrag { get; set; }

    public Betaalinstructie betaalinstructie { get; set; }


    public int burger_id { get; set; }

    public bool credit { get; set; }

    public int id { get; set; }
    public string offset_account_iban { get; set; }

    public string offset_account_name { get; set; }
    public string omschrijving { get; set; }

    public string uuid { get; set; }

    // public DateTime valid_from { get; set; }

    // public object valid_through { get; set; }
  }

  public struct RootObject
  {
    public List<Afspraak> afspraken { get; set; }
  }
}
