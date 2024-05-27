using Core.CommunicationModels.ReportModels.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using UserApi.Producers.Interfaces;

namespace UserApi.Web.Endpoints;

public static class ReportsEndpoints
{
  public static RouteGroupBuilder MapReportsEndpoints(this RouteGroupBuilder group)
  {
    group.MapGet("/monthly", GetTransactionsReport)
      .WithName("GetTransactionsReport")
      .WithOpenApi(
        operation => new OpenApiOperation(operation)
        {
          Description = "Get a income and expenses report for the given time period",
          Parameters =
          [
            new OpenApiParameter
            {
              Name = "startDate",
              Description = "Start date of the report as a unix timestamp",
              Required = true,
              In = ParameterLocation.Query
            },
            new OpenApiParameter
            {
              Name = "endDate",
              Description = "End date of the report as a unix timestamp",
              Required = true,
              In = ParameterLocation.Query
            }
          ]
        })
      .Produces<IMonthlyReport>()
      .Produces(StatusCodes.Status404NotFound)
      .Produces(StatusCodes.Status204NoContent);
    return group;
  }

  private static async Task<IResult> GetTransactionsReport(string startDate, string endDate, IMonthlyReportProducer producer, HttpRequest request)
  {
    IMonthlyReport? result = await producer.RequestMonthlyReport(
      long.Parse(startDate),
      long.Parse(endDate),
      request.Headers["X-User-Bsn"]!);
    return result != null ? Results.Ok(result) : Results.NoContent();
  }
}
