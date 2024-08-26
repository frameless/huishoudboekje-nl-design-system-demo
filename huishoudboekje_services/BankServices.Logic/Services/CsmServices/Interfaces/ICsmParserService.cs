using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Interfaces;

public interface ICsmParserService
{
  public Task Parse(IHhbFile file);
}
