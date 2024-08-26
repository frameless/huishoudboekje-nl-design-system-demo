using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

public class UnMatchTransactionFromRecordsHandler(IPaymentRecordRepository paymentRecordRepository) : IQueryHandler<UnMatchTransactionsFromRecords, bool>
{
  public async Task<bool> HandleAsync(UnMatchTransactionsFromRecords query)
  {
    IList<IPaymentRecord> records =
    await  paymentRecordRepository.GetAll(false, new PaymentRecordFilter() { TransactionUuids = query.TransactionIds });

    foreach (IPaymentRecord record in records)
    {
      record.TransactionUuid = null;
      record.Reconciled = false;
    }

    return await paymentRecordRepository.Update(records);
  }
}
