using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBOutOfRangeException : HHBException
{
  public HHBOutOfRangeException(
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

  public HHBOutOfRangeException(string error, string readable, StatusCode statusCode) : base(
    error,
    readable,
    statusCode)
  {
  }
}
