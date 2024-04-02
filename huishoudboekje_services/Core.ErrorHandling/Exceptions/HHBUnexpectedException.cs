using System.Diagnostics;
using System.Runtime.InteropServices.JavaScript;
using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBUnexpectedException : HHBException
{
  public HHBUnexpectedException(
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

  public HHBUnexpectedException(
    string error,
    string readable,
    Exception actualException) : base(error, readable, actualException, GetLocationFromException(actualException))
  {
  }

  public HHBUnexpectedException(string error, Exception actualException) : this(
    error,
    "An unexpected error occured. Please contact support",
    actualException)
  {
  }

  public HHBUnexpectedException(Exception actualException) : this(
    $"unexpected error of type {actualException.GetType().ToString()}",
    "An unexpected error occured. Please contact support",
    actualException)
  {
  }

  private static string GetLocationFromException(Exception exception)
  {
    StackTrace trace = new StackTrace(exception, true);
    StackFrame frame = trace.GetFrames().First();
    int lineNumber = frame.GetFileLineNumber();
    string? fileName = frame.GetFileName();
    return $"{fileName} at {frame}:L{lineNumber}";
  }
}
