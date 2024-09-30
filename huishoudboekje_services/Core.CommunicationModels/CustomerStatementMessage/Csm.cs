using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace Core.CommunicationModels.CustomerStatementMessage;

public class Csm : ICsm
{
  public string UUID { get; set; }

  public string TransactionReference { get; set; }

  public string AccountIdentification { get;set; }
  public long UploadedAt { get; set; }

  public IHhbFile File { get; set; }

  public IList<ITransactionModel> Transactions { get; set; }
}
