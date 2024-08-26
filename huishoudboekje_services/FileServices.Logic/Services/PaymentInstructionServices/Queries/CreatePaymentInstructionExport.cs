using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using FileServices.Logic.Services.Interfaces;

namespace FileServices.Logic.Services.PaymentInstructionServices.Queries;


internal record CreatePaymentInstructionExport(IList<IPaymentRecord> Records, ConfigurationAccountConfig ConfigurationAccountConfig) : IQuery<IHhbFile>;
