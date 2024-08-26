using BankServices.Logic.Parsers;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Commands;
using BankServices.Logic.Services.CsmServices.Interfaces;
using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.Notifications;
using Core.ErrorHandling.Exceptions;
using Core.ErrorHandling.Exceptions.Base;
using Core.utils.DateTimeProvider;
using MassTransit;

namespace BankServices.Logic.Services.CsmServices.CommandHandlers;

public class ParseCsmCommandHandler(ICsmService csmService, IDateTimeProvider dateTimeProvider, IConfigurationProducer configurationProducer, IPublishEndpoint publishEndpoint, IReconciliationProducer reconciliationProducer) : ICommandHandler<ParseCsm>
{
  public async Task HandleAsync(ParseCsm command)
  {
    try
    {
      ICsmFileParser fileParser = new CamtFileParser(dateTimeProvider, csmService, configurationProducer);
      ICsm csm = await fileParser.Parse(command.csmFile);
      ICsm created = await csmService.Create(csm);
      await reconciliationProducer.StartReconciliation(created.UUID);
    }
    catch (Exception exception)
    {
      await DeleteFile(command.csmFile);
      await NotifyError(command.csmFile, exception);
      throw;
    }
  }


  private Task DeleteFile(IHhbFile file)
  {
    DeleteFile deleteMessage = new()
    {
      uuid = file.UUID
    };
    return publishEndpoint.Publish(deleteMessage);
  }

  private Task NotifyError(IHhbFile file, Exception exception)
  {
    string message = exception is HHBException hhbException ? hhbException.ReadableMessage : "An unknown error occurred ";
    bool isDataException = exception is HHBDataException;
    Notification errorMessage = new()
    {
      Message = isDataException ? message : "messages.csm.parsing.errorMessage",
      Title = "messages.csm.parsing.errorTitle",
      AdditionalProperties = new Dictionary<string, string>()
    };
    errorMessage.AdditionalProperties.Add("file", file.Name);
    if (!isDataException)
    {
      errorMessage.AdditionalProperties.Add("message", message);
    }
    return publishEndpoint.Publish(errorMessage);
  }
}
