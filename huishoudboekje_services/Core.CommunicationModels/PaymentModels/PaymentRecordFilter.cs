using Core.CommunicationModels.PaymentModels.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class PaymentRecordFilter : IPaymentRecordFilter
{
  public IList<string>? AgreementUuids { get; set; }
  public bool? Exported { get; set; } = null!;
  public IList<string>? PaymentExportUuids { get; set; }
  public long? FromProcessingDate { get; set; }
  public long? ThroughProcessingDate { get; set; }
  public bool? Reconciled { get; set; } = null!;
  public IList<string>? TransactionUuids { get; set; }
}
