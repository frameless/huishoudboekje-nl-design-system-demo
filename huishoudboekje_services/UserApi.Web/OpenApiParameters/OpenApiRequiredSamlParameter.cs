using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace UserApi.Web.OpenApiParameters;

public class OpenApiRequiredSamlParameter : IOperationFilter
{
  public void Apply(OpenApiOperation operation, OperationFilterContext context)
  {
    operation.Parameters ??= new List<OpenApiParameter>();
    if (!operation.Parameters.Any(parameter => parameter.Name.Equals("X-Saml-Token")))
    {
      operation.Parameters.Add(
        new OpenApiParameter
        {
          Name = "X-Saml-Token",
          Description = "Saml authentication token",
          Required = true,
          In = ParameterLocation.Header
        });
    }
  }
}
