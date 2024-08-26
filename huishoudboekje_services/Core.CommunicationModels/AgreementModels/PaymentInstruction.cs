using Core.CommunicationModels.AgreementModels.Interfaces;

namespace Core.CommunicationModels.AgreementModels;

public class PaymentInstruction : IPaymentInstruction
{
  public IList<int>? ByMonth { get; set; }
  public IList<int>? ByMonthDay { get; set; }
  public IList<int>? ByDay { get; set; }
  public long StartDate { get; set; }
  public long? EndDate { get; set; }


  // 1 = once, 2 = monthly, 3 = weekly
  public int Type { get; set; }
}
