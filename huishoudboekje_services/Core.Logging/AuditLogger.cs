using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text.Json;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using Core.utils.Helpers;
using Grpc.Core;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Core.Logging;

public class AuditLogger(ILogger<LogInterceptor> logger, IPublishEndpoint publishEndpoint, IConfiguration config)
{
  private readonly ILogger _logger = logger;
  private readonly JwtSecurityTokenHandler _tokenHandler = new();

  public Task LogRequest<TRequest, TResponse>(ServerCallContext context, TRequest request, TResponse response)
  {
    JwtSecurityToken? jwtToken = GetJwtToken(context);
    UserActivity activity = new UserActivity
    {
      Action = GetAction(context, IsLogRequest(context)),
      UserId = jwtToken == null && AuthDisabled()
        ? "No jwt token, auth disabled"
        : jwtToken.ToString() ?? throw new HHBMissingAuditLogInfoException(
          "jwt token not found",
          "No JWT token was provided"),
      Meta = GetMeta(GetUserAgent(context), jwtToken),
      Timestamp = GetTimeStamp()
    };
    activity.Entities = AddEntities(activity.Action) ? GetEntities(GetEntityType(context), response) : [];
    if (AddAfter(activity.Action))
    {
      activity.SnapshotAfter = GetAfter(response);
    }

    return publishEndpoint.Publish<IUserActivityLog>(activity);
  }

  private bool IsLogRequest(ServerCallContext context)
  {
    string? isLogRequest = context.RequestHeaders.Get("log-request")?.Value;
    return isLogRequest != null && isLogRequest.Equals(config["HHB_LOG_SECRET"]);
  }

  private JwtSecurityToken? GetJwtToken(ServerCallContext context)
  {
    if (AuthDisabled())
    {
      return null;
    }

    string? jwtToken = MetadataHelper.GetCookieFromMetadata(context.RequestHeaders, "cookies", "app-token");
    if (jwtToken == null)
    {
      throw new HHBMissingAuditLogInfoException("User info not found", "No valid user info was sent with this request");
    }

    return _tokenHandler.ReadJwtToken(jwtToken);
  }

  private string GetUserAgent(ServerCallContext context)
  {
    string? userAgent = context.RequestHeaders.Get("client-user-agent")?.Value;
    if (userAgent == null)
    {
      throw new HHBMissingAuditLogInfoException("User agent not found", "The user-agent could not be found");
    }

    return userAgent;
  }

  private string GetMeta(string userAgent, JwtSecurityToken? jwtToken)
  {
    Dictionary<string, string> metaData = new Dictionary<string, string>();
    metaData.Add("userAgent", userAgent);
    if (jwtToken != null && !AuthDisabled())
    {
      metaData.Add("name", GetNameFromJwt(jwtToken));
    }

    return JsonSerializer.Serialize(metaData);
  }

  private string GetAction(ServerCallContext context, bool isLogRequest)
  {
    string action = context.Method.Replace("/GrpcServices.", "");
    if (action.Equals(""))
    {
      throw new HHBMissingAuditLogInfoException("Action not found", "An invalid gRPC action was requested");
    }

    if (isLogRequest)
    {
      action += "LogRequest";
    }

    return action;
  }

  private string GetEntityType(ServerCallContext context)
  {
    string helper = context.Method.Replace("/GrpcServices.", "");
    string entityType = helper.Remove(helper.IndexOf('/'));
    if (entityType.Equals(""))
    {
      throw new HHBMissingAuditLogInfoException("EntityType not found", "The entity type could not be found");
    }

    return entityType;
  }

  private long GetTimeStamp()
  {
    //TODO convert to custom function?
    return DateTimeOffset.Now.ToUnixTimeSeconds();
  }

  private IList<IUserActivityEntity> GetEntities<TResponse>(string entityType, TResponse response)
  {
    if (response == null || response.ToString()!.Replace(" ", "").Equals("{}"))
    {
      return [];
    }

    List<IUserActivityEntity> entities = new List<IUserActivityEntity>();
    if (response.GetType().GetProperty("Data") != null)
    {
      object dataProperty = response.GetType().GetProperty("Data")?.GetValue(response, null)!;
      if (dataProperty is IEnumerable enumerable)
      {
        entities.AddRange(
          from object? item in enumerable
          select new UserActivityEntity { EntityId = GetId(item), EntityType = entityType });
      }
      else
      {
        throw new Exception($"Expected IEnumerable but found {dataProperty.GetType()}, cannot log request");
      }
    }
    else
    {
      entities.Add(
        new UserActivityEntity
        {
          EntityId = GetId(response),
          EntityType = entityType
        });
    }

    return entities;
  }

  private string GetId(object? obj)
  {
    string? id = obj?.GetType().GetProperty("Id")?.GetValue(obj, null)?.ToString();
    if (id is null or "")
    {
      throw new HHBMissingAuditLogInfoException("EntityId not found", "The given entity ID could not be found");
    }

    return id;
  }

  private bool AddAfter(string action)
  {
    return !action.Contains("/Get");
  }

  private bool AddEntities(string action)
  {
    return !action.EndsWith("Count");
  }

  private string GetAfter<TResponse>(TResponse response)
  {
    return response.ToString() ?? throw new HHBMissingAuditLogInfoException(
      "Response not found when it was expected",
      "The service failed to provide a response");
  }

  private bool AuthDisabled()
  {
    return config["HHB_USE_AUTH"] == "0";
  }

  private string GetNameFromJwt(JwtSecurityToken token)
  {
    if (token.Payload.TryGetValue("name", out var value))
    {
      return value.ToString() ?? throw new HHBMissingAuditLogInfoException(
        "Name not found in jwt token",
        "A name claim could not be found in the given token");
    }

    throw new HHBMissingAuditLogInfoException(
      "Could not get name from jwt token",
      "An error occured trying to get the name claim from given token");
  }
}
