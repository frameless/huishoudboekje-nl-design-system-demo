using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBNotFoundException : HHBException
{

  public HHBNotFoundException(
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

  public HHBNotFoundException(
    string error,
    string readable,
    StatusCode statusCode) : base(
    error,
    readable,
    statusCode)
  {
  }

  public HHBNotFoundException(string error, string readable) : base(
    error,
    readable)
  {
  }
}
