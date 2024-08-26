using Core.CommunicationModels.Files.Interfaces;

namespace Core.CommunicationModels.PaymentModels.Interfaces;

public interface IPaymentExport
{
  public string Uuid { get; }
  public long CreatedAt { get; }
  public long StartDate { get; }
  public long EndDate { get; }
  public string FileUuid { get; }

  public string Sha256 { get; set; }

  public IList<IPaymentRecord> Records { get; set; }
}
