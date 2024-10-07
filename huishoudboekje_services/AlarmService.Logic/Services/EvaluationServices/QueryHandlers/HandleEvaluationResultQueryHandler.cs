using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.Notifications;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.MessageQueue.CommonProducers;

namespace AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

internal class HandleEvaluationResultQueryHandler(IAlarmRepository alarmRepository, ISignalRepository signalRepository, IRefetchProducer refetchProducer)
  : IQueryHandler<HandleEvaluationResult, bool>
{
  public async Task<bool> HandleAsync(HandleEvaluationResult query)
  {
    IList<ISignalModel> signalsToCreate = query.EvaluationResult.Evaluations
      .SelectMany(entry => entry.Signals.Select(signalResult => signalResult.Signal)).ToList();
    List<IAlarmModel> alarmsToUpdate = AlarmsToUpdate(query);
    IList<ISignalModel> signalsAlreadyExisting =
      await SignalsAlreadyExisting(query.EvaluationResult.Evaluations.SelectMany(eval => eval.Signals).ToList());
    signalsToCreate = signalsToCreate.Where(signal => !signalsAlreadyExisting.Contains(signal)).ToList();

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

    await refetchProducer.PublishRefetchRequest(new Refetch() { Type = RefetchType.signalcount });
    return createdSignal && updatedAlarms;
  }

  private async Task<IList<ISignalModel>> SignalsAlreadyExisting(IList<SignalResult> signalsToCreate)
  {
    IList<ISignalModel> signalsAlreadyExisting = new List<ISignalModel>();
    foreach (SignalResult result in signalsToCreate)
    {
      IList<ISignalModel> signals = await signalRepository.GetAll(
        false,
        new SignalFilterModel() { CitizenIds = new List<string>() { result.Signal.CitizenUuid }, Types = [result.Signal.Type]});
      if (signals.Count <= 0) continue;
      foreach (ISignalModel existingSignal in signals)
      {
        if (result.UpdateExisting == false ||
            (result.Signal.Type is 2 or 3 && !HasMatchingJournalEntryuuids(result, existingSignal)))
          continue;
        ISignalModel signalToUpdate = result.UpdateExisting ? existingSignal : result.Signal;
        if (result.Signal.Type == 3)
        {
          //Multiple transaction signal gets updated with new journal entries in evaluator
          signalToUpdate = result.Signal;
        }
        signalToUpdate.UpdatedAt = result.Signal.CreatedAt;
        signalToUpdate.IsActive = true;
        await signalRepository.Update(signalToUpdate);
        signalsAlreadyExisting.Add(result.Signal);
        break;
      }
    }

    return signalsAlreadyExisting;
  }

  private static bool HasMatchingJournalEntryuuids(SignalResult result, ISignalModel existingSignal)
  {
    return result.Signal.JournalEntryUuids.Any(entryUuid => existingSignal.JournalEntryUuids.Contains(entryUuid));
  }

  private static List<IAlarmModel> AlarmsToUpdate(HandleEvaluationResult query)
  {
    List<IAlarmModel> alarmsToUpdate = [];

    foreach (Evaluation evaluation in query.EvaluationResult.Evaluations)
    {
      if (evaluation.Alarm == null || evaluation.NewCheckOnDate == null) continue;
      evaluation.Alarm.CheckOnDate = evaluation.NewCheckOnDate;
      if (evaluation.NewCheckOnDate > evaluation.Alarm.EndDate)
      {
        evaluation.Alarm.IsActive = false;
      }

      alarmsToUpdate.Add(evaluation.Alarm);
    }

    return alarmsToUpdate;
  }
}
