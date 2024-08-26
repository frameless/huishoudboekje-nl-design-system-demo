using AlarmService.Logic.Helpers;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.EvaluationServices.QueryHandlers;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.utils.DateTimeProvider;
using Microsoft.Extensions.Logging;

namespace AlarmService.Logic.Services.EvaluationServices;

public class EvaluatorService(
  IAlarmService alarmService,
  ISignalService signalService,
  IEvaluationResultService evaluationResultService,
  ICheckAlarmProducer checkAlarmProducer,
  IDateTimeProvider dateTimeProvider,
  CheckOnDateHelper checkOnDateHelper,
  EvaluationHelper evaluationHelper,
  ILogger<EvaluatorService> logger)
  : IEvaluatorService
{
  public async Task<bool> EvaluateReconciliatedJournalEntries(
    IDictionary<string, string> agreementAlarms,
    IList<IJournalEntryModel> reconcilliatedEntries,
    IDictionary<string, string> alarmToCitizen)
  {
    EvaluateReconciliatedJournalEntries query = new (agreementAlarms, reconcilliatedEntries, alarmToCitizen);
    EvaluateReconciliatedJournalEntriesQueryHandler handler = new(alarmService, signalService, evaluationResultService, checkAlarmProducer,
      dateTimeProvider, checkOnDateHelper, evaluationHelper);
    return await handler.HandleAsync(query);
  }

  public async Task<bool> EvaluateMissingTransactionAlarms()
  {
    EvaluateMissingTransactions query = new ();
    EvaluateMissingTransactionsQueryHandler handler = new(alarmService, evaluationResultService,  checkAlarmProducer,
      dateTimeProvider, checkOnDateHelper);
    return await handler.HandleAsync(query);
  }

  public async Task<bool> EvaluateCitizenSaldos(IList<string> citizenUuids, int threshold)
  {
    EvaluateCitizenSaldo query = new (citizenUuids, threshold);
    EvaluateCitizenSaldoQueryHandler handler = new(evaluationResultService, checkAlarmProducer, dateTimeProvider, logger);
    return await handler.HandleAsync(query);
  }
}
