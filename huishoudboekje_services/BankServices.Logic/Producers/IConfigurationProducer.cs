using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.PaymentModels;

namespace BankServices.Logic.Producers;

public interface IConfigurationProducer
{
  public Task<string> GetAccountIban();

  public Task<ConfigurationAccountConfig> GetAccountConfig();
}
