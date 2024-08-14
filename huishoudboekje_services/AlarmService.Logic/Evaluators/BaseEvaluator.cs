namespace AlarmService.Logic.Evaluators;

public abstract class BaseEvaluator<T>
{

  public EvaluationResult Evaluate(IList<T> evaluationInfoList)
  {
    EvaluationResult result = new();
    foreach (T evaluationInfo in evaluationInfoList)
    {
      try
      {
        Evaluation? evaluation = GetEvaluation(evaluationInfo);
        if (evaluation == null) continue;
        result.Evaluations.Add(evaluation);
      }
      catch (Exception)
      {
        Console.WriteLine(PrintError(evaluationInfo));
      }
    }
    return result;
  }

  protected abstract Evaluation? GetEvaluation(T evaluationInfo);
  protected abstract string PrintError(T evaluationInfo);

}
