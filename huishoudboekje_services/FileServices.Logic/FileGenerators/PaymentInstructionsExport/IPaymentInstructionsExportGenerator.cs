using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace FileServices.Logic.FileGenerators.PaymentInstructionsExport;

public interface IPaymentInstructionsExportGenerator
{
  public Task<byte[]> Generate(IList<IPaymentRecord> records, ConfigurationAccountConfig config);
}
