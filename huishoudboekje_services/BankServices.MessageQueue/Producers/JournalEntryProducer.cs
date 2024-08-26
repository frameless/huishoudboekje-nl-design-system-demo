using System.Net.Http.Json;
using System.Text.Json;
using BankServices.Logic.Producers;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BankServices.MessageQueue.Producers;

public class JournalEntryProducer(IConfiguration config) : IJournalEntryProducer
{
  public async Task<IList<string>> Delete(IEnumerable<string> transactionIds)
  {
    using HttpClient client = new();
    HttpRequestMessage request = new()
    {
      Method = HttpMethod.Delete,
      RequestUri = new Uri(
        $"{config["HHB_HUISHOUDBOEKJE_SERVICE"]}/journaalposten_delete"),
    };
    request.Content = JsonContent.Create(new { transaction_ids = transactionIds });
    try
    {
      HttpResponseMessage response = await client.SendAsync(request);
      DeleteResponse deleteResponse = JsonSerializer.Deserialize<DeleteResponse>(await response.Content.ReadAsStringAsync());
      int statusCode = (int)response.StatusCode;
      if (statusCode != StatusCodes.Status200OK)
      {
        throw new HHBDataException(
          $"Unexpected statusCode {response.StatusCode}, could not delete",
          "Could not delete transactions");
      }

      return deleteResponse.data.Select(value => value.uuid).ToList();
    }
    catch (HttpRequestException ex)
    {
      throw new HHBConnectionException(
        "Error during REST call to hhb service",
        "Something went wrong while getting data",
        ex,
        StatusCode.Unknown);
    }
  }


  internal struct DeleteResponse
  {
    public List<DeleteUuid> data { get; set; }
  }

  internal struct DeleteUuid
  {
    public string uuid { get; set; }
  }
}
