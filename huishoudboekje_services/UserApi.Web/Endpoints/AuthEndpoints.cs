using Core.CommunicationModels.ReportModels.Interfaces;
using Microsoft.OpenApi.Models;
using UserApi.Producers.Interfaces;
using UserApi.Services.AuthServices.Interfaces;
using UserApi.Services.Interfaces;

namespace UserApi.Web.Endpoints;

public static class AuthEndpoints
{
  public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/token", GetToken)
      .WithName("GetToken")
      .WithOpenApi(
        operation => new OpenApiOperation(operation)
        {
          Description = "Get a temporary token using an api key",
          Parameters =
          [
            new OpenApiParameter
            {
              Name = "X-Api-Key",
              Description = "Api key",
              Required = true,
              In = ParameterLocation.Header
            }
          ]
        })
      .Produces<string>()
      .Produces(StatusCodes.Status404NotFound);
    return group;
  }

  private static async Task<IResult> GetToken(IAuthService authService, HttpRequest request)
  {
    return Results.Ok(await authService.GenerateNewToken(request.HttpContext.Connection.RemoteIpAddress?.ToString(), request.Headers["X-Api-Key"]));
  }
}
