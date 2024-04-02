using System.Text.Json;
using Core.CommunicationModels.Citizen;
using Microsoft.Extensions.Configuration;
using UserApi.Producers.HttpModels;
using UserApi.Producers.Interfaces;

namespace UserApi.Producers;

public class MinimalCitizenDataHttpProducer(IConfiguration config) : IMinimalCitizenDataProducer
{
  public async Task<MinimalCitizenData> RequestCitizenData(string bsn)
  {
    BasicCitizenDataHttpItem data = null;
    using var client = new HttpClient();
    var request = new HttpRequestMessage
    {
      Method = HttpMethod.Get,
      RequestUri = new Uri(config["HHB_HUISHOUDBOEKJE_SERVICE_URL"] + $"/burgers?filter_bsn={bsn}&columns=bsn,voornamen,achternaam"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      HttpProducerResponse<IList<BasicCitizenDataHttpItem>>? responseObject = JsonSerializer.Deserialize<HttpProducerResponse<IList<BasicCitizenDataHttpItem>>>(response);
      data = responseObject.data[0];
    }
    catch (Exception ex)
    {
      // TODO: Logging
      Console.Write(ex);
    }
    if (data == null)
    {
      throw new Exception("Could not get citizen data");
    }
    return new MinimalCitizenData
    {
      Bsn = data.bsn,
      FirstNames = data.voornamen,
      LastName = data.achternaam
    };
  }
}
