using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Core.Auth.ConcreteAuthCheckers;

public class AsymmetricKeyChecker : JWTTokenChecker
{
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();
    private readonly HttpClient _httpClient = new();
    private readonly string _alg;
    private readonly string _jwksEndpoint;
    private readonly ILogger _logger;

    public AsymmetricKeyChecker(string alg, string jwksEndpoint, string issuer, string audience, ILogger logger)
    {
        this._logger = logger;
        this._alg = alg;
        this._jwksEndpoint = jwksEndpoint;
        this._tokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = issuer,
            ValidAudience = audience,
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    }

    protected override bool VerifyUserToken(string token)
    {
        var key = this.GetPublicKey(this.GetKidFromHeader(token), this._jwksEndpoint);
        if (key != null)
        {
            var asymmetricKey = this.CreateSecurityKey(this._alg, key);
            this._tokenValidationParameters.IssuerSigningKey = asymmetricKey;
            try
            {
                var claims = this._tokenHandler.ValidateToken(
                    token,
                    this._tokenValidationParameters,
                    out var validatedToken);
                return true;
            }
            catch (SecurityTokenException ex)
            {
                this._logger.LogWarning(ex.ToString());
                return false;
            }
        }

        return false;
    }

    private string GetKidFromHeader(string token)
    {
        var jwtToken = this._tokenHandler.ReadJwtToken(token);
        return jwtToken.Header.Kid;
    }

    private AsymmetricSecurityKey CreateSecurityKey(string alg, JsonWebKey key)
    {
        if (alg.ToLower().StartsWith("rs") || alg.ToLower().StartsWith("ps"))
        {
            // For PS (RSASSA-PSS) algorithm and RS (RSA) algorithm
            return this.CreateRsaKey(key);
        }
        else if (alg.ToLower().StartsWith("es"))
        {
            // For ES (ECDSA) algorithm
            return this.CreateECDsaKey(key, alg);
        }
        else
        {
            throw new NotSupportedException("Unsupported algorithm: " + alg);
        }
    }

    private RsaSecurityKey CreateRsaKey(JsonWebKey key)
    {
        var rsaKey = RSA.Create();
        rsaKey.ImportParameters(
            new RSAParameters
            {
                Exponent = Base64UrlEncoder.DecodeBytes(key.E),
                Modulus = Base64UrlEncoder.DecodeBytes(key.N)
            });
        return new RsaSecurityKey(rsaKey);
    }

    private ECDsaSecurityKey CreateECDsaKey(JsonWebKey key, string alg)
    {
        var curve = ECCurve.NamedCurves.nistP256;
        if (alg.ToLower().EndsWith("384"))
        {
            curve = ECCurve.NamedCurves.nistP384;
        }

        if (alg.EndsWith("512"))
        {
            curve = ECCurve.NamedCurves.nistP521;
        }

        var ecParams = new ECParameters
        {
            Curve = curve,
            Q = new ECPoint
            {
                X = Base64UrlEncoder.DecodeBytes(key.X),
                Y = Base64UrlEncoder.DecodeBytes(key.Y)
            }
        };
        var ecdsaKey = ECDsa.Create(ecParams);
        return new ECDsaSecurityKey(ecdsaKey);
    }

    private JsonWebKey? GetPublicKey(string kid, string jwksEndpoint)
    {
        var jwksResponse = this._httpClient.GetStringAsync(jwksEndpoint).Result;
        var jwks = new JsonWebKeySet(jwksResponse);
        return jwks.Keys.First(key => key.Kid.ToString() == kid);
    }
}