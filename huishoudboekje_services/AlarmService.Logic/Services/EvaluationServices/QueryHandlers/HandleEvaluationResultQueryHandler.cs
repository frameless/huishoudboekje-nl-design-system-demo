using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Evaluators;
using AlarmService.Logic.Services.EvaluationServices.Queries;
using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.QueryHandlers;

internal class HandleEvaluationResultQueryHandler(IAlarmRepository alarmRepository, ISignalRepository signalRepository) : IQueryHandler<HandleEvaluationResult, bool>
{

  public async Task<bool> HandleAsync(HandleEvaluationResult query)
  {
    IList<ISignalModel> signalsToCreate = query.EvaluationResult.Evaluations.SelectMany(entry => entry.Signals).ToList();
    List<IAlarmModel> alarmsToUpdate = AlarmsToUpdate(query);
    IList<ISignalModel> signalsAlreadyExisting = await SignalsAlreadyExisting(signalsToCreate);
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

    return createdSignal && updatedAlarms;
  }

  private async Task<IList<ISignalModel>> SignalsAlreadyExisting(IList<ISignalModel> signalsToCreate)
  {
    IList<ISignalModel> signalsAlreadyExisting = new List<ISignalModel>();
    foreach (ISignalModel signal in signalsToCreate)
    {
      IList<ISignalModel> signals = await signalRepository.GetAll(
        false,
        new SignalFilterModel() { CitizenIds = new List<string>() { signal.CitizenUuid }});
      if (signals.Count <= 0) continue;
      foreach (ISignalModel existingSignal in signals)
      {
        if (existingSignal.Type != signal.Type) continue;
        existingSignal.UpdatedAt = signal.CreatedAt;
        existingSignal.IsActive = true;
        await signalRepository.Update(existingSignal);
        signalsAlreadyExisting.Add(signal);
        break;
      }
    }
    return signalsAlreadyExisting;
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
