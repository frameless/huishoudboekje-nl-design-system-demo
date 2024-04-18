using System.Text.Json;
using Core.CommunicationModels.Citizen;
using Core.ErrorHandling.Exceptions;
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
      RequestUri = new Uri(config["HHB_HUISHOUDBOEKJE_SERVICE"] + $"/burgers?filter_bsn={bsn}&columns=bsn,voornamen,achternaam"),
    };
    try
    {
      string response = await client.SendAsync(request).Result.Content.ReadAsStringAsync();
      HttpProducerResponse<IList<BasicCitizenDataHttpItem>>? responseObject = JsonSerializer.Deserialize<HttpProducerResponse<IList<BasicCitizenDataHttpItem>>>(response);
      data = responseObject.data[0];
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
    if (data == null)
    {
      throw new HHBDataException(
        "Executed request correctly but did not receive any data",
        "No data received from huishoudboekjeservice");
    }
    return new MinimalCitizenData
    {
      Bsn = data.bsn,
      FirstNames = data.voornamen,
      LastName = data.achternaam
    };
  }
}
