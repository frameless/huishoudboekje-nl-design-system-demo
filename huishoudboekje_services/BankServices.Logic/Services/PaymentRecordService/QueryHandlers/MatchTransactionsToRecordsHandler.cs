using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

public class MatchTransactionsToRecordsHandler(
  IDateTimeProvider dateTimeProvider,
  IPaymentRecordRepository paymentRecordRepository) : IQueryHandler<MatchTransactionsToRecords, bool>
{
  private readonly float AMOUNT_THRESHHOLD = 0.01f;

  public async Task<bool> HandleAsync(MatchTransactionsToRecords query)
  {
    IList<string> agreementsThatGotTransactionsAdded =
      query.Information.Select(journalEntry => journalEntry.AgreementUuid).ToList();

    // records that are exported, not yet reconciled
    IList<IPaymentRecord> notReconciledRecords = await paymentRecordRepository.GetAll(false,
      new PaymentRecordFilter()
      {
        Exported = true, Reconciled = false,
        AgreementUuids = agreementsThatGotTransactionsAdded
      });

    // Early return if there are no open payment records
    if (notReconciledRecords.Count == 0)
      return true;

    Dictionary<string, List<IPaymentRecord>> paymentRecordDict = notReconciledRecords.GroupBy(record => record.AgreementUuid)
      .ToDictionary(group => group.Key, group => group.ToList());

    IList<IPaymentRecord> matches = GetMatchableRecords(query.Information, paymentRecordDict);

    if (matches.Count > 0)
    {
      return await paymentRecordRepository.Update(matches);
    }

    return true;
  }

  private IList<IPaymentRecord> GetMatchableRecords(IList<IJournalEntryModel> journalEntries, Dictionary<string, List<IPaymentRecord>> paymentRecordDict)
  {
    IList<IPaymentRecord> matches = new List<IPaymentRecord>();

    foreach (IJournalEntryModel journalEntry in journalEntries)
    {
      foreach (IPaymentRecord record in paymentRecordDict[journalEntry.AgreementUuid])
      {
        if (DoesTransactionMatch(journalEntry, record))
        {
          record.Reconciled = true;
          record.TransactionUuid = journalEntry.BankTransactionUuid;
          matches.Add(record);
        }
      }
    }

    return matches;
  }

  private bool DoesTransactionMatch(IJournalEntryModel journalEntry,
    IPaymentRecord record)
  {
    if (dateTimeProvider.UnixToDateTime(record.ProcessingDate).Date ==
        dateTimeProvider.UnixToDateTime(journalEntry.Date).Date)
    {
      if (Math.Abs(record.Amount - journalEntry.Amount) < AMOUNT_THRESHHOLD)
      {
        return true;
      }
    }

    return false;
  }
}
