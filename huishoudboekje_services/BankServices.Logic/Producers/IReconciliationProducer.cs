namespace BankServices.Logic.Producers;

public interface IReconciliationProducer
{
  Task StartReconciliation(string csmUuid);
}
