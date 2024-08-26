using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class PaymentExport : IPaymentExport
{
  public string Uuid { get; set; }

  public long CreatedAt { get; set; }

  public long StartDate { get; set; }

  public long EndDate { get; set;}
  public string FileUuid { get; set; }

  public string Sha256 { get; set; }

  public IList<IPaymentRecord> Records { get; set; }
}
