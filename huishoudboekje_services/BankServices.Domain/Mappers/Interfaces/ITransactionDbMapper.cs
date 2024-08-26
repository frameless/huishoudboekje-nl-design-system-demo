using BankServices.Domain.Contexts.Models;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Domain.Mappers.Interfaces;

public interface ITransactionDbMapper
{
  public Transaction GetDatabaseObject(ITransactionModel communicationModel);
  public Paged<ITransactionModel> GetPagedCommunicationModels(Paged<Transaction> paged);

  public IList<Transaction> GetDatabaseObjects(IList<ITransactionModel> communicationModels);

  public IList<ITransactionModel> GetCommunicationModels(IEnumerable<Transaction> list);

  ITransactionModel GetCommunicationModel(Transaction executeCommand);
}
