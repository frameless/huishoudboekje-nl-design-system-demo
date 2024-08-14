using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Services.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.Queries;

internal record HandleEvaluationResult(EvaluationResult EvaluationResult) : IQuery<bool>;
