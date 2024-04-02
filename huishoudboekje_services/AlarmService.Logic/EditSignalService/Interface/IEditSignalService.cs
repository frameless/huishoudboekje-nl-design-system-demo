namespace AlarmService.Logic.EditSignalService.Interface;

public interface IEditSignalService
{
  public Task UpdateSignalsForJournalEntryRemoval(IList<string> journalEntryIds);
}
