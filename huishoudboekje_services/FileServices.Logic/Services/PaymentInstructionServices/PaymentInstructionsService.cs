using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;
using FileServices.Logic.Services.PaymentInstructionServices.Handlers;
using FileServices.Logic.Services.PaymentInstructionServices.Queries;

namespace FileServices.Logic.Services.PaymentInstructionServices;

public class PaymentInstructionsService(IHhbFileService hhbFileService, IDateTimeProvider dateTimeProvider) : IPaymentInstructionsService
{
  public Task<IHhbFile> CreatePaymentInstructionsExport(IList<IPaymentRecord> records, ConfigurationAccountConfig configurationAccountConfig)
  {
    CreatePaymentInstructionExport command = new(records, configurationAccountConfig);
    CreatePaymentInstructionExportHandler handler = new(hhbFileService, dateTimeProvider);
    return handler.HandleAsync(command);
  }
}
