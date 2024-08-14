using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Evaluators.AlarmEvaluators;
using AlarmService.Logic.Evaluators.AlarmEvaluators.Reconciliation;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

internal class EvaluateReconciliatedJournalEntriesQueryHandler(
  IAlarmService alarmService,
  ISignalService signalService,
  IEvaluationResultService evaluationResultService,
  ICheckAlarmProducer checkAlarmProducer,
  IDateTimeProvider dateTimeProvider,
  CheckOnDateHelper checkOnDateHelper,
  EvaluationHelper evaluationHelper) : IQueryHandler<EvaluateReconciliatedJournalEntries, bool>
{

  public async Task<bool> HandleAsync(EvaluateReconciliatedJournalEntries query)
  {
    ReconciliationEvaluator evaluator = new(dateTimeProvider, checkOnDateHelper, evaluationHelper);

    IList<IAlarmModel> alarmModels = await alarmService.GetActiveByIds(query.AgreementAlarms.Values.ToList());
    IList<ISignalModel> signals = await signalService.GetAll(false, new SignalFilterModel() { AlarmIds = query.AgreementAlarms.Values.ToList() });
    Dictionary<string, List<IJournalEntryModel>> journalEntriesPerAlarm = MatchJournalEntriesWithAlarms(query);
    Dictionary<string, string> alarmToAgreement = query.AgreementAlarms.ToDictionary(x => x.Value, x => x.Key);
    Dictionary<string, IList<IJournalEntryModel>> existingJournalEntriesForAgreementAndPeriod = await GetJournalEntriesForAgreementsInPeriod(journalEntriesPerAlarm, alarmModels);


    IList<AlarmEvaluationInfo> evaluationInfos = [];
    foreach (IAlarmModel alarm in alarmModels)
    {
      string agreementId = alarmToAgreement[alarm.UUID];
      evaluationInfos.Add(new AlarmEvaluationInfo()
      {
        Alarm = alarm,
        ExistingSignals = signals.Where(signal => signal.AlarmUuid.Equals(alarm.UUID)).ToList(),
        PeriodSeperatedEntries = evaluationHelper.GetJournalEntriesWithMatchingPeriod(alarm, existingJournalEntriesForAgreementAndPeriod[agreementId]),
        NewJournalEntries = journalEntriesPerAlarm[alarm.UUID],
        AgreementId = agreementId,
        CitizenId = query.AlarmToCitizen[alarm.UUID]
      });
    }
    EvaluationResult evaluation = evaluator.Evaluate(evaluationInfos);
    return await evaluationResultService.HandleEvaluationResult(evaluation);
  }

  private async Task<Dictionary<string, IList<IJournalEntryModel>>> GetJournalEntriesForAgreementsInPeriod(Dictionary<string, List<IJournalEntryModel>> journalEntriesWithAlarms,
    IList<IAlarmModel> alarmModels)
  {
    Dictionary<string, IAlarmModel> lookupDictAlarms = alarmModels.ToDictionary(alarm => alarm.UUID, alarm => alarm);
    List<string> agreementUuids = new();
    long minDate = long.MaxValue;
    long maxDate = long.MinValue;
    foreach (KeyValuePair<string, List<IJournalEntryModel>> entry in journalEntriesWithAlarms)
    {
      IAlarmModel alarm = lookupDictAlarms[entry.Key];
      foreach (IJournalEntryModel journalEntry in entry.Value)
      {
        if (journalEntry.Date - alarm.DateMargin < minDate)
        {
          minDate = journalEntry.Date;
        }

        if (journalEntry.Date + alarm.DateMargin > maxDate)
        {
          maxDate = journalEntry.Date;
        }

        agreementUuids.Add(journalEntry.AgreementUuid);
      }
    }

    // In the current system, requesting the same min and max date does not give a valid response.
    // Realistically it should return the given transaction and maybe any other made on that day.
    if (minDate == maxDate)
    {
      // minus one day in seconds (unix)
      minDate -= 86400;

      // plus one day in seconds (unix)
      maxDate += 86400;
    }

    DateRange range = new()
    {
      From = dateTimeProvider.UnixToDateTime(minDate),
      To = dateTimeProvider.UnixToDateTime(maxDate)
    };
    Dictionary<string, IList<IJournalEntryModel>> journalEntriesForAgreementAndPeriod =
      await checkAlarmProducer.RequestJournalEntriesForAgreementAndPeriod(agreementUuids.Distinct().ToList(), range);
    return journalEntriesForAgreementAndPeriod;
  }

  private static Dictionary<string, List<IJournalEntryModel>> MatchJournalEntriesWithAlarms(EvaluateReconciliatedJournalEntries query)
  {
    Dictionary<string, List<IJournalEntryModel>> journalEntriesWithAlarms =
      query.ReconcilliatedEntries.Where(entry => query.AgreementAlarms.TryGetValue(entry.AgreementUuid, out _))
        .GroupBy(entry => query.AgreementAlarms[entry.AgreementUuid]).ToDictionary(
          group =>
            group.Key,
          group => group.ToList());
    return journalEntriesWithAlarms;
  }
}
