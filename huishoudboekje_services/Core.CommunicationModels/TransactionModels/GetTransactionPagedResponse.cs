using Core.CommunicationModels.TransactionModels.Interfaces;

namespace Core.CommunicationModels.TransactionModels;

public class GetTransactionPagedResponse
{
  public Paged<ITransactionModel>? Data { get; set; }
}
