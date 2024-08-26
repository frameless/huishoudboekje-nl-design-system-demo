using Core.CommunicationModels.TransactionModels.Interfaces;

namespace Core.CommunicationModels.TransactionModels;

public class GetTransactionResponse
{
  public IList<ITransactionModel>? Data { get; set; }
}
