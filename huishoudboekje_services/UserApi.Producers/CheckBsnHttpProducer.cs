using System.Text.Json;
using Core.ErrorHandling.Exceptions;
using Microsoft.Extensions.Configuration;
using UserApi.Producers.HttpModels;
using UserApi.Producers.Interfaces;

namespace UserApi.Producers;

public class CheckBsnHttpProducer(IConfiguration config) : ICheckBsnProducer
{
  public async Task<bool> RequestCheckBsn(string bsn)
  {
    bool result = false;
    using var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri(config["HHB_HUISHOUDBOEKJE_SERVICE"] + $"/burgers?filter_bsn={bsn}&columns=bsn"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      result = ValidResponseData(response, bsn);
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
    return result;
  }

  private bool ValidResponseData(string response, string bsn)
  {
    HttpProducerResponse<IList<CheckBsnHttpItem>>? bsnHttpProducerResponse = JsonSerializer.Deserialize<HttpProducerResponse<IList<CheckBsnHttpItem>>>(response);
    return bsnHttpProducerResponse != null && bsnHttpProducerResponse.data.Count == 1 && bsnHttpProducerResponse.data[0].bsn.ToString().Equals(bsn);
  }
}
