using Core.CommunicationModels.AgreementModels.Interfaces;

namespace Core.CommunicationModels.AgreementModels;

public class MinimalAgreement : IAgreement
{
  public string UUID { get; set; }

  public int Amount { get; set; }

  public string Description { get; set; }

  public IAccount OffsetAccount { get; set; }

  //public string paymentInstructionUuid { get; set; }
}
