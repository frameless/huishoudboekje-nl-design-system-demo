using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.EditSignalService.Interface;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Logic.EditSignalService;

public class EditSignalService(ISignalRepository signalRepository) : IEditSignalService
{
  private int SIGNAL_TYPE_MULTIPLE = 3;
  private int SIGNAL_TYPE_AMOUNT = 2;

  public async Task UpdateSignalsForJournalEntryRemoval(IList<string> journalEntryIds)
  {
    IList<ISignalModel> signals = await GetByJournalEntryIds(false, journalEntryIds);
    Dictionary<string, List<string>> journalEntryPerSignal = signals.ToDictionary(
      signal => signal.UUID,
      signal => signal.JournalEntryUuids!.Where(id => journalEntryIds.Contains(id)).ToList());

    if (signals.Count > 0)
    {
      foreach (ISignalModel signal in signals)
      {
        if (signal.Type == SIGNAL_TYPE_AMOUNT)
        {
          await HandleSignalTypeAmount(signal);
        }

        if (signal.Type == SIGNAL_TYPE_MULTIPLE)
        {
          await HandleSignalTypeMultiple(signal, journalEntryPerSignal[signal.UUID]);
        }
      }
    }
  }

  private async Task HandleSignalTypeMultiple(ISignalModel signal, IList<string> journalEntryIds)
  {
    if (signal.JournalEntryUuids?.Count - journalEntryIds.Count <= 1)
    {
      await signalRepository.Delete(signal.UUID);
    }
    else
    {
      foreach (string id in journalEntryIds)
      {
        signal.JournalEntryUuids?.Remove(id);
      }
      
      await signalRepository.Update(signal);
    }
  }

  private async Task HandleSignalTypeAmount(ISignalModel signal)
  {
    await signalRepository.Delete(signal.UUID);
  }

  private Task<IList<ISignalModel>> GetByJournalEntryIds(bool tracking, IList<string> ids)
  {
    return signalRepository.GetAll(tracking, new SignalFilterModel() { JournalEntryIds = ids });
  }
}
