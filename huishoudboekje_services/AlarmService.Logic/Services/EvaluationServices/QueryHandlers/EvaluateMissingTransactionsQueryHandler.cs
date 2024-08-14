using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Evaluators.AlarmEvaluators;
using AlarmService.Logic.Evaluators.AlarmEvaluators.Timed;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

internal class EvaluateMissingTransactionsQueryHandler(
  IAlarmService alarmService,
  IEvaluationResultService evaluationResultService,
  ICheckAlarmProducer checkAlarmProducer,
  IDateTimeProvider dateTimeProvider,
  CheckOnDateHelper checkOnDateHelper) : IQueryHandler<EvaluateMissingTransactions, bool>
{

  public async Task<bool> HandleAsync(EvaluateMissingTransactions query)
  {
    TimeFrameEvaluator evaluator = new(dateTimeProvider, checkOnDateHelper);

    IList<IAlarmModel> alarmModels = await alarmService.GetAllActiveByCheckOnDateBefore(dateTimeProvider.EndOfDay(dateTimeProvider.Today()));

    IDictionary<string, IDictionary<string, string>> alarmToCitizen =
      await checkAlarmProducer.RequestCitizensForAlarms(alarmModels.Select(alarm => alarm.UUID).ToList());

    IList<AlarmEvaluationInfo> evaluationInfos = [];
    foreach (IAlarmModel alarm in alarmModels)
    {
      evaluationInfos.Add(new AlarmEvaluationInfo()
      {
        Alarm = alarm,
        AgreementId = alarmToCitizen[alarm.UUID]["agreement"],
        CitizenId = alarmToCitizen[alarm.UUID]["citizen"]
      });
    }
    EvaluationResult evaluation = evaluator.Evaluate(evaluationInfos);
    return await evaluationResultService.HandleEvaluationResult(evaluation);
  }
}
