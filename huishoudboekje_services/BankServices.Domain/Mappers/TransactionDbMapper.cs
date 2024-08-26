using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Domain.Mappers;

public class TransactionDbMapper : ITransactionDbMapper
{
  public Transaction GetDatabaseObject(ITransactionModel communicationModel)
  {
    Transaction result = new()
    {
      Amount = communicationModel.Amount,
      Date = communicationModel.Date,
      FromAccount = communicationModel.FromAccount,
      IsCredit = communicationModel.IsCredit,
      IsReconciled = communicationModel.IsReconciled,
      InformationToAccountOwner = communicationModel.InformationToAccountOwner
    };
    if (communicationModel.UUID != null)
    {
      result.Uuid = Guid.Parse(communicationModel.UUID);
    }
    return result;
  }
  public IList<Transaction> GetDatabaseObjects(IList<ITransactionModel> communicationModels)
  {
    return communicationModels.Select(GetDatabaseObject).ToList();
  }

  public IList<ITransactionModel> GetCommunicationModels(IEnumerable<Transaction> list)
  {
    return list.Select(GetCommunicationModel).ToList();
  }

  public Paged<ITransactionModel> GetPagedCommunicationModels(Paged<Transaction> paged)
  {
    return new Paged<ITransactionModel>(
      paged.Data.Select(GetCommunicationModel).ToList(),
      paged.TotalCount);
  }

  public ITransactionModel GetCommunicationModel(Transaction transaction)
  {
    return new TransactionModel()
    {
      Amount = transaction.Amount,
      Date = transaction.Date,
      FromAccount = transaction.FromAccount,
      IsCredit = transaction.IsCredit,
      IsReconciled = transaction.IsReconciled,
      InformationToAccountOwner = transaction.InformationToAccountOwner,
      UUID = transaction.Uuid.ToString(),
      CustomerStatementMessageUUID = transaction.CustomerStatementMessageUuid.ToString()
    };
  }
}
