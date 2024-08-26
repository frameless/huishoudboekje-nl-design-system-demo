using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels;

namespace BankServices.Logic.Services.PaymentRecordService.Queries;

public record MatchTransactionsToRecords(IList<IJournalEntryModel> Information) : IQuery<bool>
{
}
