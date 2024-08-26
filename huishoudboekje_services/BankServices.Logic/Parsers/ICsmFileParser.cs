using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Parsers;

public interface ICsmFileParser
{
  public Task<ICsm> Parse(IHhbFile file);
}
