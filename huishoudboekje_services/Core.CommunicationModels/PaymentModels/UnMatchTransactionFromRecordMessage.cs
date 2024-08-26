using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class UnMatchTransactionFromRecordMessage
{
  public IList<string> TransactionIds { get; set; }
}
