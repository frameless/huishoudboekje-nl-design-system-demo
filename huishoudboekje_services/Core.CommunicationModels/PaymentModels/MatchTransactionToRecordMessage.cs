using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace Core.CommunicationModels.PaymentModels;

public class MatchTransactionToRecordMessage
{
  public IList<IJournalEntryModel> TransactionInfo { get; set; }
}

