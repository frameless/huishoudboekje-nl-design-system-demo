using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace Core.CommunicationModels.CustomerStatementMessage;

public interface ICsm
{
  public string UUID { get; }
  public string TransactionReference { get; }
  public string AccountIdentification { get; }
  public long UploadedAt { get; }

  IHhbFile File { get; }
  public IList<ITransactionModel> Transactions { get; }
}
