using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels;

namespace BankServices.Logic.Services.PaymentRecordService.Queries;

public record UnMatchTransactionsFromRecords(IList<string> TransactionIds) : IQuery<bool>
{

}
