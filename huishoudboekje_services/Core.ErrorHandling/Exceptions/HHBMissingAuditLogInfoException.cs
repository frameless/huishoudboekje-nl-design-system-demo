using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBMissingAuditLogInfoException : HHBException
{
  public HHBMissingAuditLogInfoException(
    string error,
    string readable,
    Exception actualException,
    StatusCode statusCode) : base(
    error,
    readable,
    actualException,
    statusCode)
  {
  }

  public HHBMissingAuditLogInfoException(string error, string readable) : base(
    error,
    readable)
  {
  }
}
