using Core.CommunicationModels.AgreementModels.Interfaces;

namespace Core.CommunicationModels.AgreementModels;

public class Account : IAccount
{
  public string Iban { get; set; }

  public string Name { get; set; }
}
