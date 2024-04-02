﻿using Core.ErrorHandling.Exceptions.Base;
using Grpc.Core;

namespace Core.ErrorHandling.Exceptions;

public class HHBMissingEnvironmentVariableException : HHBException
{
  public HHBMissingEnvironmentVariableException(
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

  public HHBMissingEnvironmentVariableException(
    string error,
    string readable,
    StatusCode statusCode) : base(
    error,
    readable,
    statusCode)
  {
  }

  public HHBMissingEnvironmentVariableException(string error, string readable) : base(
    error,
    readable)
  {
  }
}