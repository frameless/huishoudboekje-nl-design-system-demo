using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class CreatePaymentExportMessage
{
  public IList<IPaymentRecord> records { get; set; }

  public ConfigurationAccountConfig ConfigurationAccountConfig { get; set; }
}
