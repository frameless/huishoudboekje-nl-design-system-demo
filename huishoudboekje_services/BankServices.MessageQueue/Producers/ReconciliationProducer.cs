using System.Net;
using System.Net.Http.Json;
using BankServices.Logic.Producers;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using MassTransit;
using Microsoft.Extensions.Configuration;

namespace BankServices.MessageQueue.Producers;

public class ReconciliationProducer(ISendEndpointProvider sendEndpointProvider, IConfiguration configuration) : IReconciliationProducer
{
  public async Task StartReconciliation(string csmUuid)
  {
    await PublishMessageInPython(
      Guid.NewGuid().ToString(),
      "start-reconciliation",
      "{\"CustomerStatementMessageId\": \"" + csmUuid + "\"}");
  }

  private async Task PublishMessageInPython(
    string correlationId,
    string responseQueue,
    string message)
  {
    using HttpClient client = new HttpClient();
    string? hhbUrl = configuration["HHB_HUISHOUDBOEKJE_SERVICE"];
    HttpRequestMessage request = new HttpRequestMessage()
    {
      Method = HttpMethod.Post,
      RequestUri = new Uri($"{hhbUrl}/msq")
    };
    request.Content =
      JsonContent.Create(new { queue_name = responseQueue, corr_id = correlationId, message = message });
    try
    {
      HttpResponseMessage response = await client.SendAsync(request);
      if (response.StatusCode != HttpStatusCode.OK)
      {
        throw new HHBConnectionException(
          "Error during REST call to huishoudboekje service",
          "Something went wrong while getting data",
          StatusCode.Unknown);
      }
    }
    catch (HttpRequestException ex)
    {
      throw new HHBConnectionException(
        "Error during REST call to huishoudboekje service",
        "Something went wrong while getting data",
        ex,
        StatusCode.Unknown);
    }
  }
}
