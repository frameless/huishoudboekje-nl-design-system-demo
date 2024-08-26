using Core.CommunicationModels.PaymentModels.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class PaymentRecord : IPaymentRecord
{
  public string UUID { get; set; }

  public string AgreementUuid { get; set; }

  public string? PaymentExportUuid { get; set; }

  public int Amount { get; set; }

  public long CreatedAt { get; set; }

  public long ProcessingDate { get; set; }

  public long OriginalProcessingDate { get; set; }

  public string AccountName { get; set; }

  public string AccountIban { get; set; }

  public string Description { get; set; }
  public bool Reconciled { get; set; }
  public string? TransactionUuid { get; set; }
}
