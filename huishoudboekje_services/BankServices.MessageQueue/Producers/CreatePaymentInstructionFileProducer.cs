using BankServices.Logic.Producers;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using MassTransit;

namespace BankServices.MessageQueue.Producers;

public class CreatePaymentInstructionFileProducer(IRequestClient<CreatePaymentExportMessage> requestClient, IConfigurationProducer configurationProducer) : ICreatePaymentInstructionFileProducer
{
  public async Task<IHhbFile> CreatePaymentInstructionFile(IList<IPaymentRecord> records)
  {
    CreatePaymentExportMessage message = new CreatePaymentExportMessage()
    {
      records = records,
      ConfigurationAccountConfig = await configurationProducer.GetAccountConfig()
    };
    Response<CreatePaymentExportResponse> response = await requestClient.GetResponse<CreatePaymentExportResponse>(message);
    return response.Message.createdExportFile;
  }
}
