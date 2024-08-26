using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.CommandHandlers;
using BankServices.Logic.Services.CsmServices.Commands;
using BankServices.Logic.Services.CsmServices.Interfaces;
using Core.CommunicationModels.Files.Interfaces;
using Core.utils.DateTimeProvider;
using MassTransit;

namespace BankServices.Logic.Services.CsmServices;

public class CsmParserService(ICsmService csmService, IDateTimeProvider dateTimeProvider, IConfigurationProducer configurationProducer, IPublishEndpoint publishEndpoint, IReconciliationProducer reconciliationProducer) : ICsmParserService
{
  public Task Parse(IHhbFile file)
  {
    ParseCsm parseCsmCommand = new(file);
    ParseCsmCommandHandler parseCsmCommandHandler = new(csmService, dateTimeProvider, configurationProducer, publishEndpoint, reconciliationProducer);
    return parseCsmCommandHandler.HandleAsync(parseCsmCommand);
  }
}
