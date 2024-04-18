using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.JournalEntryModel;

public class JournalEntryModel : IJournalEntryModel
{
  public string UUID { get; set; }

  public int Amount { get; set; }

  public long Date { get; set; }

  public bool IsAutomaticallyReconciled { get; set; }

  public string AgreementUuid { get; set; }

  public string BankTransactionUuid { get; set; }

  public string StatementUuid { get; set; }
}
