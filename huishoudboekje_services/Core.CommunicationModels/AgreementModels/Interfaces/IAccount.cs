namespace Core.CommunicationModels.AgreementModels.Interfaces;

public interface IAccount
{
  string Iban { get; set; }
  string Name { get; set; }
}
