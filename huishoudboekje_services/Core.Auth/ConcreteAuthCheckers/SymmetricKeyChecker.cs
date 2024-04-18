using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Core.Auth.ConcreteAuthCheckers;

public class SymmetricKeyChecker : JWTTokenChecker
{
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly JwtSecurityTokenHandler _tokenHandler = new();

    public SymmetricKeyChecker(string alg, string secret, string issuer, string audience)
    {
        this._tokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidAlgorithms = new[] { alg }
        };
    }

    protected override bool VerifyUserToken(string token)
    {
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
            return false;
        }
    }
}