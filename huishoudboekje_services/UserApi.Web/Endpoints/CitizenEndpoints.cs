using Core.CommunicationModels.Citizen.Interfaces;
using Microsoft.OpenApi.Models;
using UserApi.Producers.Interfaces;

namespace UserApi.Web.Endpoints;

public static class CitizenEndpoints
{
  public static RouteGroupBuilder MapCitizenEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/", GetCitizenData)
      .WithName("GetCitizenData")
      .WithOpenApi(
        operation => new OpenApiOperation(operation)
        {
          Description = "Get basic info of a Citizen",
        })
      .Produces<IMinimalCitizenData>()
      .Produces(StatusCodes.Status404NotFound);
    return group;
  }

  private static async Task<IResult> GetCitizenData(IMinimalCitizenDataProducer producer, HttpRequest request)
  {
    return Results.Ok(await producer.RequestCitizenData(request.Headers["X-User-Bsn"]!));
  }
}
