namespace Core.CommunicationModels.JournalEntryModel.Interfaces;

public interface IJournalEntryModel
{
  public string UUID { get; }
  public int Amount { get; }
  public long Date { get; }
  public bool IsAutomaticallyReconciled { get; }
  public string AgreementUuid { get; }
  public string BankTransactionUuid { get; }
}
