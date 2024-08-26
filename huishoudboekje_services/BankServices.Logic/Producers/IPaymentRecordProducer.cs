using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.utils.DataTypes;

namespace BankServices.Logic.Producers;

public interface IPaymentRecordProducer
{
  public Task<IDictionary<IAgreement, IPaymentInstruction>> GetAgreementsWithPaymentInstruction(DateRange dateRange);
}
