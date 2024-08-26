using BankServices.Logic.Producers;
using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.utils.DataTypes;

namespace BankServices.Tests.PaymentRecordServiceTests.Utils.Fakes;

public class FakePaymentInstructionProducer : IPaymentRecordProducer
{
  private IDictionary<IAgreement, IPaymentInstruction> database = new Dictionary<IAgreement, IPaymentInstruction>();

  public async Task<IDictionary<IAgreement, IPaymentInstruction>> GetAgreementsWithPaymentInstruction(DateRange dateRange)
  {
    return database;
  }


  public void SetDatabase(IDictionary<IAgreement, IPaymentInstruction> data)
  {
    database = data;
  }
}
