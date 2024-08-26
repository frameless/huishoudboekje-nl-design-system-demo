using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;

namespace BankServices.Logic.Services.PaymentRecordService.Interfaces;

public interface IPaymentRecordService
{
  Task<IList<IPaymentRecord>> CreatePaymentRecords(DateRange dateRange, long? processAt);

  Task<IList<IPaymentRecord>> GetByIds(IList<string> ids);

  Task<IList<IPaymentRecord>> GetNotExportedRecords(long from, long till);
  Task<IList<IPaymentRecord>> GetAllNotExportedRecords();
  Task<bool> UpdateMany(IList<IPaymentRecord> records);

  Task<bool> MatchTransactionsToPaymentRecords(IList<IJournalEntryModel> transactionInfo);
  Task<IList<IPaymentRecord>> GetNotReconciledPaymentRecordsForAgreements(IList<string> agreementIds);

  Task<bool> UnMatchTransactionsFromPaymentRecords(IList<string> ids);
}
