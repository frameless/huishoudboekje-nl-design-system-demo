using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

[Serializable]
public class HHBDatabaseException : HHBException
{
  public HHBDatabaseException(
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
  public HHBDatabaseException(
    string error,
    string readable,
    StatusCode statusCode) : base(
    error,
    readable,
    statusCode)
  {
  }

  public HHBDatabaseException(string error, string readable) : base(
    error,
    readable)
  {
  }
}
