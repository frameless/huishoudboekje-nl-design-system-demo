using BankService_RPC;
using BankServices.Grpc.Mappers;
using BankServices.Grpc.Mappers.Interfaces;
using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using Grpc.Core;
using PaymentRecordService = BankService_RPC.PaymentRecordService;

namespace BankServices.Grpc.Controllers;

public class PaymentRecordController(IPaymentRecordService paymentRecordService, IDateTimeProvider dateTimeProvider) : PaymentRecordService.PaymentRecordServiceBase
{
  private readonly IPaymentRecordMapper _mapper = new PaymentRecordMapper();

  public override async Task<CreatePaymentRecordResponse> CreatePaymentRecords(CreatePaymentRecordsData request, ServerCallContext context)
  {
    long? processAt = null;
    if (request.HasProcessAt)
    {
      processAt = request.ProcessAt;
    }

    IList<IPaymentRecord> communicationModels = await paymentRecordService.CreatePaymentRecords(
      new DateRange(dateTimeProvider.UnixToDateTime(request.From), dateTimeProvider.UnixToDateTime(request.To)), processAt);

    IList<CreatePaymentRecord> items = communicationModels
      .Select(record => new CreatePaymentRecord()
      {
        Id = record.UUID,
        AgreementId = record.AgreementUuid
      }).ToList();

    var result = new CreatePaymentRecordResponse()
    {
      Count = communicationModels.Count
    };
    result.Data.AddRange(items);

    return result;
  }

  public override async Task<PaymentRecords> GetPaymentRecordsById(PaymentRecordsById request, ServerCallContext context)
  {
    var result = new PaymentRecords();
    IList<IPaymentRecord> records = await paymentRecordService.GetByIds(request.Ids);
    foreach (IPaymentRecord record in records)
    {
      result.Data.Add(_mapper.GetGrpcModel(record));
    }

    return result;
  }

  public override async Task<NotExportedPaymentRecordDates> GetNotExportedPaymentRecordDates(GetNotExportedPaymentRecordsMessage request, ServerCallContext context)
  {
    var result = new NotExportedPaymentRecordDates();
    IList<IPaymentRecord> records;
    if (request is { HasFrom: true, HasTo: true })
    {
      records = await paymentRecordService.GetNotExportedRecords(request.From, request.To);
    }
    else
    {
      records = await paymentRecordService.GetAllNotExportedRecords();
    }

    foreach (IPaymentRecord record in records)
    {
      result.Data.Add(new NotExportedRecordDate()
      {
        Date = record.OriginalProcessingDate,
        Id = record.UUID
      });
    }

    return result;
  }

  public override async Task<PaymentRecords> GetRecordsNotReconciledForAgreements(GetPaymentRecordsByAgreementsMessage request, ServerCallContext context)
  {
    var result = new PaymentRecords();
    IList<IPaymentRecord> records = await paymentRecordService.GetNotReconciledPaymentRecordsForAgreements(request.AgreementIds);
    foreach (IPaymentRecord record in records)
    {
      result.Data.Add(_mapper.GetGrpcModel(record));
    }
    return result;
  }
}
