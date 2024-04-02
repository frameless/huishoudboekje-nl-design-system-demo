using Core.CommunicationModels.TransactionModels.Interfaces;

namespace Core.CommunicationModels.TransactionModels;

public class TransactionModel : ITransactionModel
{
  public string UUID { get; set; }

  public int Amount { get; set; }

  public bool IsCredit { get; set; }

  public string FromAccount { get; set; }

  public long Date { get; set; }

  public string StatementLine { get; set; }

  public string InformationToAccountOwner { get; set; }

  public bool IsRecorded { get; set; }

  public string CustomerStatementMessageUUID { get; set; }
}
