using System.Text.Json;
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
      RequestUri = new Uri(config["HHB_HUISHOUDBOEKJE_SERVICE_URL"] + $"/burgers?filter_bsn={bsn}&columns=bsn"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      result = ValidResponseData(response, bsn);
    }
    catch (Exception ex)
    {
      // TODO: Logging
      Console.Write(ex);
    }
    return result;
  }

  private bool ValidResponseData(string response, string bsn)
  {
    HttpProducerResponse<IList<CheckBsnHttpItem>>? bsnHttpProducerResponse = JsonSerializer.Deserialize<HttpProducerResponse<IList<CheckBsnHttpItem>>>(response);
    return bsnHttpProducerResponse != null && bsnHttpProducerResponse.data.Count == 1 && bsnHttpProducerResponse.data[0].bsn.ToString().Equals(bsn);
  }
}
