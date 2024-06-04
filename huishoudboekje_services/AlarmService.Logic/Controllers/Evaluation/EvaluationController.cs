using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.AlarmEvaluation.Reconciliation;
using AlarmService.Logic.AlarmEvaluation.Saldo;
using AlarmService.Logic.AlarmEvaluation.Timed;
using AlarmService.Logic.Misc;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;

namespace AlarmService.Logic.Controllers.Evaluation;

public class EvaluationController(
  ISignalRepository signalRepository,
  IAlarmRepository alarmRepository,
  ICheckAlarmProducer checkAlarmProducer,
  IDateTimeProvider dateTimeProvider,
  EvaluationHelper evaluationHelper)
  : IEvaluationController
{
  public async Task<bool> EvaluateReconciliatedJournalEntries(
    IDictionary<string, string> agreementAlarms,
    IList<IJournalEntryModel> reconcilliatedEntries,
    IDictionary<string, string> alarmToCitizen)
  {
    ReconciliationEvaluator evaluator = new(dateTimeProvider, evaluationHelper);

    IList<IAlarmModel> alarmModels = await alarmRepository.GetMultipleByIdsNoTracking(agreementAlarms.Values.ToList());
    Dictionary<string, IAlarmModel> lookupDictAlarms = alarmModels.ToDictionary(alarm => alarm.UUID, alarm => alarm);
    Dictionary<string, List<ISignalModel>> signalsPerAlarm =
      await GetExistingSignalsPerAlarm(agreementAlarms.Values.ToList());

    // Match journal entries with a given alarm uuid.
    Dictionary<string, List<IJournalEntryModel>> journalEntriesWithAlarms =
      reconcilliatedEntries.Where(entry => agreementAlarms.TryGetValue(entry.AgreementUuid, out _))
        .GroupBy(entry => agreementAlarms[entry.AgreementUuid]).ToDictionary(
          group =>
            group.Key,
          group => group.ToList());
    List<string> agreementUuids = new();
    long minDate = long.MaxValue;
    long maxDate = long.MinValue;
    foreach (var entry in journalEntriesWithAlarms)
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

    DateRange range = new DateRange()
    {
      From = dateTimeProvider.UnixToDateTime(minDate),
      To = dateTimeProvider.UnixToDateTime(maxDate)
    };
    Dictionary<string, IList<IJournalEntryModel>> journalEntriesForAgreementAndPeriod =
      await checkAlarmProducer.RequestJournalEntriesForAgreementAndPeriod(agreementUuids.Distinct().ToList(), range);

    Dictionary<string, string> alarmToAgreement = agreementAlarms.ToDictionary(x => x.Value, x => x.Key);

    EvaluationResult evaluation = evaluator.Evaluate(
      journalEntriesWithAlarms,
      lookupDictAlarms,
      journalEntriesForAgreementAndPeriod,
      alarmToAgreement,
      alarmToCitizen,
      signalsPerAlarm);

    return await HandleEvaluationAsync(evaluation, lookupDictAlarms);
  }

  public async Task<bool> EvaluateMissingTransactionAlarms()
  {
    TimeFrameEvaluator evaluator = new(dateTimeProvider, evaluationHelper);
    IList<IAlarmModel> alarmModels =
      await alarmRepository.GetAllByCheckOnDateBeforeNoTracking(dateTimeProvider.EndOfDay(dateTimeProvider.Today()));

    IDictionary<string, IDictionary<string, string>> alarmToCitizen =
      await checkAlarmProducer.RequestCitizensForAlarms(alarmModels.Select(alarm => alarm.UUID).ToList());

    EvaluationResult evaluation = evaluator.Evaluate(alarmModels, alarmToCitizen);

    IDictionary<string, IAlarmModel> lookupDictAlarms = alarmModels.ToDictionary(alarm => alarm.UUID, alarm => alarm);

    return await HandleEvaluationAsync(evaluation, lookupDictAlarms);
  }

  public async Task<bool> EvaluateBurgerSaldos(IList<string> citizenUuids, int threshhold)
  {
    SaldoEvaluator evaluator = new SaldoEvaluator(dateTimeProvider);
    Dictionary<string, int> saldos = await checkAlarmProducer.RequestCitizenSaldos(citizenUuids);
    EvaluationResult evaluation = evaluator.Evaluate(saldos, threshhold);
    IList<ISignalModel> signalsToCreate = evaluation.Evaluations.SelectMany(entry => entry.Signals).ToList();
    IList<ISignalModel> signalsAlreadyExisting = new List<ISignalModel>();
    foreach (ISignalModel signal in signalsToCreate)
    {
      IList<ISignalModel> signals = await signalRepository.GetAll(
        false,
        new SignalFilterModel() { CitizenIds = new List<string>() { signal.CitizenUuid }});
      if (signals.Count > 0)
      {
        foreach (var existingSignal in signals)
        {
          if (existingSignal.Type == signal.Type)
          {
            existingSignal.UpdatedAt = signal.CreatedAt;
            existingSignal.IsActive = true;
            await signalRepository.Update(existingSignal);
            signalsAlreadyExisting.Add(signal);
            break;
          }
        }
      }
    }

    signalsToCreate = signalsToCreate.Where(signal => !signalsAlreadyExisting.Contains(signal)).ToList();
    return await signalRepository.InsertMany(signalsToCreate);
  }

  private async Task<Dictionary<string, List<ISignalModel>>> GetExistingSignalsPerAlarm(IList<string> alarmIds)
  {
    IList<ISignalModel> signals = await signalRepository.GetAll(false, new SignalFilterModel() { AlarmIds = alarmIds });
    Dictionary<string, List<ISignalModel>> grouped = signals.GroupBy(signal => signal.AlarmUuid).ToDictionary(
      group =>
        group.Key,
      group => group.ToList());

    return grouped;
  }

  private async Task<bool> HandleEvaluationAsync(
    EvaluationResult evaluationResult,
    IDictionary<string, IAlarmModel> lookupDictAlarms)
  {
    IList<ISignalModel> signalsToCreate = evaluationResult.Evaluations.SelectMany(entry => entry.Signals).ToList();
    IList<IAlarmModel> alarmsToUpdate = new List<IAlarmModel>();

    foreach (var evaluation in evaluationResult.Evaluations)
    {
      AlarmModel alarm = (AlarmModel)lookupDictAlarms[evaluation.AlarmUuid];
      if (evaluation.NewCheckOnDate != null)
      {
        alarm.UpdateCheckOnDate(evaluation.NewCheckOnDate);
      }

      alarmsToUpdate.Add(alarm);
    }

    bool createdSignal = true;
    bool updatedAlarms = true;

    if (alarmsToUpdate.Count > 0)
    {
      updatedAlarms = await alarmRepository.UpdateMany(alarmsToUpdate);
    }

    if (signalsToCreate.Count > 0)
    {
      createdSignal = await signalRepository.InsertMany(signalsToCreate);
    }

    return createdSignal && updatedAlarms;
  }
}
