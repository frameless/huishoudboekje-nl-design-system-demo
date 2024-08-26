using BankServices.Domain.Contexts.Models;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Domain.Mappers.Interfaces;

public interface ICsmDbMapper
{
  public CustomerStatementMessage GetDatabaseObject(ICsm communicationModel);

  public ICsm GetCommunicationModel(CustomerStatementMessage databaseObject);

  public Paged<ICsm> GetPagedCommunicationModels(Paged<CustomerStatementMessage> paged);
}
