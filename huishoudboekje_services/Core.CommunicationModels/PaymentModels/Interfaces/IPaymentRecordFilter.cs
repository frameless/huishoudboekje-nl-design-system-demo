namespace Core.CommunicationModels.PaymentModels.Interfaces;

public interface IPaymentRecordFilter
{
  public IList<string>? AgreementUuids { get; set; }
  public bool? Exported { get; set; }
  public IList<string>? PaymentExportUuids { get; set; }

  public long? FromProcessingDate { get; set; }
  public long? ThroughProcessingDate { get; set; }

  public bool? Reconciled { get; set; }
  public IList<string>? TransactionUuids { get; set; }

}
