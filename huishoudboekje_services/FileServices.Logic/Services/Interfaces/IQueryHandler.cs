﻿namespace FileServices.Logic.Services.Interfaces;

internal interface IQueryHandler<in TQuery, TResult> where TQuery : IQuery<TResult>
{
  Task<TResult> HandleAsync(TQuery query);
}
