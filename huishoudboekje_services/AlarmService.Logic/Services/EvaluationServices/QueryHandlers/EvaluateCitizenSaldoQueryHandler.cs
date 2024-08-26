using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Evaluators.SaldoEvaluators;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.utils.DateTimeProvider;
using Microsoft.Extensions.Logging;

namespace AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

internal class EvaluateCitizenSaldoQueryHandler(
  IEvaluationResultService evaluationResultService,
  ICheckAlarmProducer checkAlarmProducer,
  IDateTimeProvider dateTimeProvider,
  ILogger<EvaluatorService> logger) : IQueryHandler<EvaluateCitizenSaldo, bool>
{

  public async Task<bool> HandleAsync(EvaluateCitizenSaldo query)
  {
    SaldoEvaluator evaluator = new(dateTimeProvider, query.Threshold);
    Dictionary<string, int> saldos = await checkAlarmProducer.RequestCitizenSaldos(query.CitizenUuids);
    EvaluationResult evaluation = evaluator.Evaluate(saldos.ToList());
    return await evaluationResultService.HandleEvaluationResult(evaluation);
  }
}
