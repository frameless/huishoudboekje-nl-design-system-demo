using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class CreatePaymentExportResponse
{
  public IHhbFile createdExportFile { get; set; }
}
