using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

namespace AlarmService.Logic.Services.EvaluationServices;

public class EvaluationResultService(IAlarmRepository alarmRepository, ISignalRepository signalRepository) : IEvaluationResultService
{
  public Task<bool> HandleEvaluationResult(EvaluationResult evaluationResult)
  {
    HandleEvaluationResult query = new(evaluationResult);
    HandleEvaluationResultQueryHandler handler = new(alarmRepository, signalRepository);
    return handler.HandleAsync(query);
  }
}
