using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using BankServices.Logic.Services.PaymentRecordService.QueryHandlers;
using BankServices.Logic.Services.TransactionServices.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;

namespace BankServices.Logic.Services.PaymentRecordService;

public class PaymentRecordService : IPaymentRecordService
{
  private readonly IPaymentRecordRepository _paymentRecordRepository;
  private readonly IPaymentRecordProducer _paymentRecordMessageProducer;
  private readonly IDateTimeProvider _dateTimeProvider;

  public PaymentRecordService(
    IPaymentRecordRepository paymentRecordRepository,
    IPaymentRecordProducer paymentRecordProducer,
    IDateTimeProvider dateTimeProvider)
  {
    _paymentRecordRepository = paymentRecordRepository;
    _paymentRecordMessageProducer = paymentRecordProducer;
    _dateTimeProvider = dateTimeProvider;
  }

  public async Task<IList<IPaymentRecord>> CreatePaymentRecords(DateRange dateRange, long? processAt)
  {
    CreatePaymentRecordsHandler handler = new CreatePaymentRecordsHandler(
      _paymentRecordRepository,
      _paymentRecordMessageProducer,
      _dateTimeProvider);

    return await handler.HandleAsync(new CreatePaymentRecords(dateRange, processAt));
  }

  public async Task<IList<IPaymentRecord>> GetByIds(IList<string> ids)
  {
    GetPaymentRecordsByIdHandler handler = new GetPaymentRecordsByIdHandler(
      _paymentRecordRepository);

    return await handler.HandleAsync(new GetPaymentRecordsById(ids));
  }

  public async Task<IList<IPaymentRecord>> GetNotExportedRecords(long from, long till)
  {
    return await new GetNotExportedRecordsHandler(_paymentRecordRepository).HandleAsync(
      new GetNotExportedRecords(from, till));
  }

  public async Task<IList<IPaymentRecord>> GetAllNotExportedRecords()
  {
    return await new GetAllNotExportedRecordsHandler(_paymentRecordRepository).HandleAsync(
      new GetAllNotExportedRecords());
  }
  public async Task<bool> UpdateMany(IList<IPaymentRecord> records)
  {
    UpdatePaymentRecords query = new(records);
    UpdatePaymentRecordsQueryHandler handler = new(_paymentRecordRepository);
    return await handler.HandleAsync(query);
  }

  public async Task<bool> MatchTransactionsToPaymentRecords(IList<IJournalEntryModel> transactionInfo)
  {
    MatchTransactionsToRecords query = new MatchTransactionsToRecords(transactionInfo);
    MatchTransactionsToRecordsHandler handler = new(_dateTimeProvider, _paymentRecordRepository);
    return await handler.HandleAsync(query);
  }

  public async Task<IList<IPaymentRecord>> GetNotReconciledPaymentRecordsForAgreements(IList<string> agreementIds)
  {
    GetNotReconciledPaymentRecordsForAgreementsHandler handler = new GetNotReconciledPaymentRecordsForAgreementsHandler(_paymentRecordRepository);
    return await handler.HandleAsync(new GetNotReconciledPaymentRecordsForAgreements(agreementIds));
  }

  public async Task<bool> UnMatchTransactionsFromPaymentRecords(IList<string> ids)
  {
    UnMatchTransactionFromRecordsHandler handler = new UnMatchTransactionFromRecordsHandler(_paymentRecordRepository);
    return await handler.HandleAsync(new UnMatchTransactionsFromRecords(ids));
  }
}
