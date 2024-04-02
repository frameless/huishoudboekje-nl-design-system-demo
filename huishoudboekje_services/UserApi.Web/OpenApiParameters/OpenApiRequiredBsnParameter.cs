using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace UserApi.Web.OpenApiParameters;

public class OpenApiRequiredBsnParameter : IOperationFilter
{
  public void Apply(OpenApiOperation operation, OperationFilterContext context)
  {
    operation.Parameters ??= new List<OpenApiParameter>();
    if (!operation.Parameters.Any(parameter => parameter.Name.Equals("X-User-Bsn")))
    {
      operation.Parameters.Add(
        new OpenApiParameter
        {
          Name = "X-User-Bsn",
          Description = "Bsn of the logged in user",
          Required = true,
          In = ParameterLocation.Header
        });
    }
  }
}
