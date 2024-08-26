using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Producers;

public interface ICreatePaymentInstructionFileProducer
{
  public Task<IHhbFile> CreatePaymentInstructionFile(IList<IPaymentRecord> records);
}
