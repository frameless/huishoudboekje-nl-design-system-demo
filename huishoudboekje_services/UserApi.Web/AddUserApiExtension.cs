using Microsoft.OpenApi.Models;
using UserApi.Middleware;
using UserApi.Web.Endpoints;
using UserApi.Web.OpenApiParameters;

namespace UserApi.Web;

public static class AddUserApiExtension
{
  public static IServiceCollection AddUserApi(this IServiceCollection services, IConfiguration config)
  {
    services.AddExceptionHandler<CustomExceptionHandler>();
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(
      options =>
    {
      var info = new OpenApiInfo
      {
        Title = "Huishoudboekje User API",
        Description = "This is a concept for the users api. This api can be used to collect data for one specific citizen in Huishoudboekje.",
      };
      options.SwaggerDoc(name: "v1", info: info);
      options.OperationFilter<OpenApiRequiredBsnParameter>();
      options.OperationFilter<OpenApiRequiredSamlParameter>();
    });
    return services;
  }

  public static WebApplication AddUserApi(this WebApplication app, IWebHostEnvironment env)
  {
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }
    app.UseHttpsRedirection();

    app.UseExceptionHandler("/Error");

    app.UseMiddleware<SamlAuthMiddleware>();
    app.UseMiddleware<BsnValidationMiddleware>();


    app.MapGroup("/reports").MapReportsEndpoints().WithTags("Reports");
    app.MapGroup("/citizen").MapCitizenEndpoints().WithTags("Citizen");

    return app;
  }
}
