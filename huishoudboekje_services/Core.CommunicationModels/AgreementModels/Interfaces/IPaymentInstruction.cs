namespace Core.CommunicationModels.AgreementModels.Interfaces;

public interface IPaymentInstruction
{
  public IList<int>? ByMonth { get; set; }
  public IList<int>? ByMonthDay { get; set; }
  public IList<int>? ByDay { get; set; }
  public long StartDate { get; set; }
  public long? EndDate { get; set; }
  public int Type { get; set; }
}
