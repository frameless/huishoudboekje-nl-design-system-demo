using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBParsingException : HHBException
{
  public HHBParsingException(string error, string readable, Exception? actualException) : base(
    error,
    readable,
    actualException)
  {
  }

  public HHBParsingException(string error, string readable, Exception actualException, StatusCode statusCode) : base(
    error,
    readable,
    actualException,
    statusCode)
  {
  }

  public HHBParsingException(string error, string readable, StatusCode statusCode) : base(error, readable, statusCode)
  {
  }

  public HHBParsingException(string error, string readable) : base(error, readable)
  {
  }
}
