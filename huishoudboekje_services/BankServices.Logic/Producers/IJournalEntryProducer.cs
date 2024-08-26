namespace BankServices.Logic.Producers;

public interface IJournalEntryProducer
{
  Task<IList<string>> Delete(IEnumerable<string> idList);
}
