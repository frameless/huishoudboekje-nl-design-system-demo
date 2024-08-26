using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;

namespace BankServices.Domain.Mappers;

public class CsmDbMapper(ITransactionDbMapper transactionMapper) : ICsmDbMapper
{
  public CustomerStatementMessage GetDatabaseObject(ICsm communicationModel)
  {
    CustomerStatementMessage result = new()
    {
      Transactions = transactionMapper.GetDatabaseObjects(communicationModel.Transactions),
      AccountIdentification = communicationModel.AccountIdentification,
      TransactionReference = communicationModel.TransactionReference,
      FileUuid = Guid.Parse(communicationModel.File.UUID)
    };
    if (communicationModel.UUID != null)
    {
      result.Uuid = Guid.Parse(communicationModel.UUID);
    }
    return result;
  }

  public ICsm GetCommunicationModel(CustomerStatementMessage databaseObject)
  {
    Csm result = new()
    {
      Transactions = transactionMapper.GetCommunicationModels(databaseObject.Transactions),
      AccountIdentification = databaseObject.AccountIdentification,
      TransactionReference = databaseObject.TransactionReference,
      File = new HhbFile()
      {
        UUID = databaseObject.FileUuid.ToString()
      }
    };
    if (databaseObject.Uuid != null)
    {
      result.UUID = databaseObject.Uuid.ToString();
    }
    return result;
  }

  public Paged<ICsm> GetPagedCommunicationModels(Paged<CustomerStatementMessage> paged)
  {
    return new Paged<ICsm>(
      paged.Data.Select(GetCommunicationModel).ToList(),
      paged.TotalCount);
  }
}
