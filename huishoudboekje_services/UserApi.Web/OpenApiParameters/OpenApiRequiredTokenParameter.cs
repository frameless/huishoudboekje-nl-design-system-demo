using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace UserApi.Web.OpenApiParameters;

public class OpenApiRequiredTokenParameter : IOperationFilter
{
  public void Apply(OpenApiOperation operation, OperationFilterContext context)
  {
    operation.Parameters ??= new List<OpenApiParameter>();
    if (!operation.Parameters.Any(parameter => parameter.Name.Equals("X-Api-Token") || parameter.Name.Equals("X-Api-Key")))
    {
      operation.Parameters.Add(
        new OpenApiParameter
        {
          Name = "X-Api-Token",
          Description = "Api authentication token",
          Required = true,
          In = ParameterLocation.Header
        });
    }
  }
}
