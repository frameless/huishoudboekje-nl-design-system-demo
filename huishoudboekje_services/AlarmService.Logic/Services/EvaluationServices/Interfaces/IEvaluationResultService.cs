using AlarmService.Logic.Evaluators;

namespace AlarmService.Logic.Services.EvaluationServices.Interfaces;

public interface IEvaluationResultService
{

  public Task<bool> HandleEvaluationResult(EvaluationResult evaluationResult);


}
