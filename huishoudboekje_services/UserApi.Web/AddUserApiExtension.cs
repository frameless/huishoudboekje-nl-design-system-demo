using Core.ErrorHandling.ExceptionInterceptors;
using Microsoft.OpenApi.Models;
using UserApi.Web.Endpoints;
using UserApi.Web.Middleware;
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
      OpenApiInfo info = new OpenApiInfo
      {
        Title = "Huishoudboekje User API",
        Description = "This is a concept for the users api. This api can be used to collect data for one specific citizen in Huishoudboekje.",
      };
      options.SwaggerDoc(name: "v1", info: info);
      options.OperationFilter<OpenApiRequiredBsnParameter>();
      options.OperationFilter<OpenApiRequiredTokenParameter>();
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

    app.UseMiddleware<MinimalRestApiExceptionInterceptor>();
    app.UseMiddleware<TokenAuthMiddleware>();
    app.UseMiddleware<BsnValidationMiddleware>();

    string? prefix = app.Configuration["HHB_URL_PREFIX"];
    app.MapGroup(prefix + "/reports").MapReportsEndpoints().WithTags("Reports");
    app.MapGroup(prefix + "/citizen").MapCitizenEndpoints().WithTags("Citizen");
    app.MapGroup(prefix + "/auth").MapAuthEndpoints().WithTags("Auth");

    return app;
  }
}
