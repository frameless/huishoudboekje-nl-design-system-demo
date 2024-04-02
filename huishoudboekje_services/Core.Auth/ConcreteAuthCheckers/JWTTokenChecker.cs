using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.IdentityModel.Tokens;

namespace Core.Auth.ConcreteAuthCheckers;

public abstract class JWTTokenChecker : IAuthChecker<string>
{
    public bool IsUserAllowedAccess(string credentials)
    {
      try
      {
        var userIsAllowedAccess = this.VerifyUserToken(credentials);
        return userIsAllowedAccess;
      }
      catch (SecurityTokenException ex)
      {
        throw new HHBAuthorizationException(
          "Exception occured trying to verify JWT token",
          "Unauthorized Request",
          ex,
          StatusCode.Unauthenticated);
      }
    }

    protected abstract bool VerifyUserToken(string token);
}
