namespace Core.CommunicationModels.AgreementModels.Interfaces;

public interface IAgreement
{
  string UUID { get; set; }
  int Amount { get; set; }
  string Description { get; set; }
  IAccount OffsetAccount { get; set; }
  // string paymentInstructionUuid { get; set; }
}
