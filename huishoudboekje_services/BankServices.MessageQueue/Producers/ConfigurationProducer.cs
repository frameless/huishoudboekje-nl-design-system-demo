using System.Text.Json;
using BankServices.Logic.Producers;
using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.PaymentModels;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.Extensions.Configuration;

namespace BankServices.MessageQueue.Producers;

public class ConfigurationProducer(IConfiguration config) : IConfigurationProducer
{
  public async Task<string> GetAccountIban()
  {
    using HttpClient client = new();
    HttpRequestMessage request = new()
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri(
        $"{config["HHB_HUISHOUDBOEKJE_SERVICE"]}/configuratie?filter_ids=derdengeldenrekening_iban&columns=waarde"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      ConfigurationResult configurationValues = JsonSerializer.Deserialize<ConfigurationResult>(response);
      if (configurationValues.data.Count != 1)
      {
        throw new HHBDataException("No account set in configuration", "No account iban set in configuration");
      }
      return configurationValues.data[0].waarde;
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

  public async Task<ConfigurationAccountConfig> GetAccountConfig()
  {
    using HttpClient client = new();
    HttpRequestMessage request = new()
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri(
        $"{config["HHB_HUISHOUDBOEKJE_SERVICE"]}/configuratie?filter_ids=derdengeldenrekening_rekeninghouder,derdengeldenrekening_iban,derdengeldenrekening_bic"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      ConfigurationResult configurationValues = JsonSerializer.Deserialize<ConfigurationResult>(response);
      if (configurationValues.data.Count < 3)
      {
        throw new HHBDataException("No account set in configuration", "No account info set in configuration");
      }

      return new ConfigurationAccountConfig(
        configurationValues.data.First(val => val.id is "derdengeldenrekening_rekeninghouder")
          .waarde,
        configurationValues.data.First(val => val.id is "derdengeldenrekening_iban").waarde,
        configurationValues.data.First(val => val.id is "derdengeldenrekening_bic").waarde);
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
    catch (InvalidOperationException ex)
    {
      throw new HHBDataException(
        "Missing account info",
        "Missing account info in configuration, derdengeldenrekening_rekeninghouder, derdengeldenrekening_iban and derdengeldenrekening_bic are required",
        ex,
        StatusCode.Internal);
    }
  }


  internal struct ConfigurationResult
  {
    public List<ConfigurationValue> data { get; set; }
  }

  internal struct ConfigurationValue
  {
    public string? id { get; set; }
    public string waarde { get; set; }
  }
}
