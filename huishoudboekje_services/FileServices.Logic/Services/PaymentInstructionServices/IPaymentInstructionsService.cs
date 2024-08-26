using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace FileServices.Logic.Services.PaymentInstructionServices;

public interface IPaymentInstructionsService
{
  public Task<IHhbFile> CreatePaymentInstructionsExport(
    IList<IPaymentRecord> records,
    ConfigurationAccountConfig configurationAccountConfig);
}
