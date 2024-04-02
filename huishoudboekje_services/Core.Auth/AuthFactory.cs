using System.IdentityModel.Tokens.Jwt;
using Core.Auth.ConcreteAuthCheckers;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Core.Auth;

public class AuthFactory
{
  private readonly JwtSecurityTokenHandler _tokenHandler = new();
  private readonly IConfiguration _config;
  private IAuthChecker<string>? cachedChecker = null;
  private string? cachedAlg = null;
  private readonly ILogger _logger;

  // "readable" error message here should be vague unless actual application failure (missing env ex.)
  // Give as little info as possible, error log can be specific (dont log JWT's due to private data)

  public AuthFactory(IConfiguration config, ILogger logger)
  {
    this._config = config;
    this._logger = logger;
  }

  public IAuthChecker<string> CreateOrGet(string jwtToken)
  {
    var token = this._tokenHandler.ReadJwtToken(jwtToken);
    var alg = this.GetAlgorithmFromToken(token);
    if (this.IsAlgorithmAllowed(
          alg,
          this._config["HHB_JWT_ALLOWED_ALGORITHMS"] ?? throw new HHBMissingEnvironmentVariableException(
            "HHB_JWT_ALLOWED_ALGORITHMS parameter was not supplied",
            "Environment was not set up properly, please contact support",
            StatusCode.Aborted)))
    {
      if (this.cachedAlg == alg && this.cachedChecker != null)
      {
        return this.cachedChecker;
      }

      return this.CreateAndCache(token, alg);
    }

    throw new HHBAuthorizationException(
      $"Incorrect algorithm supplied in JWT header {alg}",
      "Unauthorized Request",
      new SecurityTokenInvalidAlgorithmException(),
      StatusCode.Unauthenticated);
  }

  private IAuthChecker<string> CreateAndCache(JwtSecurityToken jwtToken, string alg)
  {
    IAuthChecker<string> checker = this.CreateCheckerFromAlg(jwtToken, alg);
    this.cachedChecker = checker;
    this.cachedAlg = alg;
    return checker;
  }

  private IAuthChecker<string> CreateCheckerFromAlg(JwtSecurityToken token, string alg)
  {
    var jwtIssuer = this._config["HHB_JWT_ISSUER"] ?? throw new HHBMissingEnvironmentVariableException(
      "HHB_JWT_ISSUER parameter was not supplied",
      "Environment was not set up properly, please contact support",
      StatusCode.Aborted);
    var jwtAudience = this._config["HHB_JWT_AUDIENCE"] ?? throw new HHBMissingEnvironmentVariableException(
      "HHB_JWT_AUDIENCE parameter was not supplied",
      "Environment was not set up properly, please contact support",
      StatusCode.Aborted);

    if (new[] { "RS256", "RS384", "RS512" }.Any(str => str == alg))
    {
      var jwksUri = this._config["HHB_JWT_JWKS_URI"] ?? throw new HHBMissingEnvironmentVariableException(
        "HHB_JWT_JWKS_URI parameter was not supplied",
        "Environment was not set up properly, please contact support",
        StatusCode.Aborted);
      return new AsymmetricKeyChecker(
        alg,
        jwksUri,
        jwtIssuer,
        jwtAudience,
        this._logger);
    }
    else if (new[] { "ES256", "ES384", "ES512" }.Any(str => str == alg))
    {
      var jwksUri = this._config["HHB_JWT_JWKS_URI"] ?? throw new HHBMissingEnvironmentVariableException(
        "HHB_JWT_JWKS_URI parameter was not supplied",
        "Environment was not set up properly, please contact support",
        StatusCode.Aborted);
      return new AsymmetricKeyChecker(
        alg,
        jwksUri,
        jwtIssuer,
        jwtAudience,
        this._logger);
    }

    else if (new[] { "PS256", "PS384", "PS512" }.Any(str => str == alg))
    {
      var jwksUri = this._config["HHB_JWT_JWKS_URI"] ?? throw new HHBMissingEnvironmentVariableException(
        "HHB_JWT_JWKS_URI parameter was not supplied",
        "Environment was not set up properly, please contact support",
        StatusCode.Aborted);
      return new AsymmetricKeyChecker(
        alg,
        jwksUri,
        jwtIssuer,
        jwtAudience,
        this._logger);
    }
    else if (new[] { "HS256", "HS256", "HS256" }.Any(str => str == alg))
    {
      var jwtSecret = this._config["HHB_JWT_SECRET"] ?? throw new HHBMissingEnvironmentVariableException(
        "HHB_JWT_SECRET parameter was not supplied",
        "Environment was not set up properly, please contact support",
        StatusCode.Aborted);
      return new SymmetricKeyChecker(
        alg,
        jwtSecret,
        jwtIssuer,
        jwtAudience);
    }

    throw new HHBAuthorizationException(
      $"Improper algorithm supplied: {alg} is not supported by this application",
      "Unauthorized Request",
      new SecurityTokenInvalidAlgorithmException(),
      StatusCode.Unauthenticated);
  }

  private string GetAlgorithmFromToken(JwtSecurityToken token)
  {
    return token.Header.Alg;
  }

  private bool IsAlgorithmAllowed(string alg, string allowedAlgs)
  {
    foreach (var allowedAlg in allowedAlgs.Split(','))
    {
      if (allowedAlg.ToLower().Equals(alg.ToLower()))
      {
        return true;
      }
    }

    return false;
  }
}
