using Core.CommunicationModels.Citizen;

namespace UserApi.Producers.Interfaces;

public interface IMinimalCitizenDataProducer
{
  public Task<MinimalCitizenData> RequestCitizenData(string bsn);
}
