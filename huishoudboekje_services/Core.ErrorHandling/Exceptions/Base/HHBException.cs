using System.Diagnostics;
using System.Runtime.CompilerServices;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions.Base;

public abstract class HHBException : Exception
{
  public string ErrorMessage { get; }

  public string ReadableMessage { get; }

  public string Location { get; }

  public StatusCode StatusCode { get; } = StatusCode.Unknown;

  public Exception? ActualException { get; }

  private int STACK_FRAME_INDEX = 2;

  public HHBException(
    string error,
    string readable,
    Exception? actualException)
  {
    StackTrace stackTrace = new StackTrace(actualException, true);
    StackFrame frame = stackTrace.GetFrame(STACK_FRAME_INDEX);

    string fileName = frame.GetFileName();
    int lineNumber = frame.GetFileLineNumber();
    string methodName = frame.GetMethod().Name;

    ErrorMessage = error;
    ReadableMessage = readable;
    Location = formatLocationString(fileName, methodName, lineNumber);
    ActualException = actualException;
  }

  public HHBException(
    string error,
    string readable,
    Exception? actualException,
    string location)
  {
    ErrorMessage = error;
    ReadableMessage = readable;
    Location = location;
    ActualException = actualException;
  }

  public HHBException(
    string error,
    string readable,
    Exception actualException,
    StatusCode statusCode)
  {
    StackTrace stackTrace = new StackTrace(actualException, true);
    StackFrame frame = stackTrace.GetFrame(STACK_FRAME_INDEX);

    string fileName = frame.GetFileName();
    int lineNumber = frame.GetFileLineNumber();
    string methodName = frame.GetMethod().Name;
    ErrorMessage = error;
    ReadableMessage = readable;
    Location = formatLocationString(fileName, methodName, lineNumber);
    StatusCode = statusCode;
    ActualException = actualException;
  }

  public HHBException(
    string error,
    string readable,
    StatusCode statusCode)
  {
    StackTrace stackTrace = new StackTrace(true);
    StackFrame frame = stackTrace.GetFrame(STACK_FRAME_INDEX);

    string fileName = frame.GetFileName();
    int lineNumber = frame.GetFileLineNumber();
    string methodName = frame.GetMethod().Name;
    ErrorMessage = error;
    ReadableMessage = readable;
    StatusCode = statusCode;
    Location = formatLocationString(fileName, methodName, lineNumber);
  }

  public HHBException(
    string error,
    string readable)
  {
    StackTrace stackTrace = new StackTrace(true);
    StackFrame frame = stackTrace.GetFrame(STACK_FRAME_INDEX);

    string fileName = frame.GetFileName();
    int lineNumber = frame.GetFileLineNumber();
    string methodName = frame.GetMethod().Name;
    ErrorMessage = error;
    ReadableMessage = readable;
    Location = formatLocationString(fileName, methodName, lineNumber);
  }

  private string formatLocationString(string fileName, string methodName, int lineNumber)
  {
    return $"{fileName}: at {methodName}:Line:{lineNumber}";
  }
}
