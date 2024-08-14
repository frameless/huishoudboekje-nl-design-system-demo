using AlarmService.Logic.Services.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.Queries;

internal record EvaluateMissingTransactions() : IQuery<bool>;
