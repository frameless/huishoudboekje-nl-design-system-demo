using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using BankServices.Logic.Services.TransactionServices.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using MassTransit;
using Microsoft.Extensions.Configuration;

namespace BankServices.MessageQueue.Consumers;

public class GetTransactionsPagedConsumer(ITransactionService transactionServices, IConfiguration config) : IConsumer<GetTransactionPagedMessage>
{
  public async Task Consume(ConsumeContext<GetTransactionPagedMessage> context)
  {
    GetTransactionPagedResponse result = new()
    {
      Data = await transactionServices.GetPaged(context.Message.Pagination, context.Message.Filter)
    };
    //TODO clean up code when python is no longer used
    string? responseQueue = context.Headers.Get<string>("PY-Callback-Queue", null);
    string? correlationId = context.Headers.Get<string>("PY-Correlation-Id", null);

    if (responseQueue != null && correlationId != null)
    {
      string message = JsonSerializer.Serialize(result);
      await PublishMessageInPython(correlationId, responseQueue, message);
    }
    else
    {
      await context.RespondAsync(result);
    }
  }

  private async Task PublishMessageInPython(
    string correlationId,
    string responseQueue,
    string message)
  {
    using HttpClient client = new HttpClient();
    string? hhbUrl = config["HHB_HUISHOUDBOEKJE_SERVICE"];
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
