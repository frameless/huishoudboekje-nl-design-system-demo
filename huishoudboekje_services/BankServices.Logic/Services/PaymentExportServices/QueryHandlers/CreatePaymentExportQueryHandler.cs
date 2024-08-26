using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Queries;
using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;

namespace BankServices.Logic.Services.PaymentExportServices.QueryHandlers;

internal class CreatePaymentExportQueryHandler(IPaymentExportRepository paymentExportRepository, IPaymentRecordService paymentRecordService, ICreatePaymentInstructionFileProducer paymentInstructionFileProducer, IDateTimeProvider dateTimeProvider) : IQueryHandler<CreatePaymentExport, string>
{
  public async Task<string> HandleAsync(CreatePaymentExport query)
  {
    IList<IPaymentRecord> records = await paymentRecordService.GetByIds(query.RecordIds);
    IHhbFile file = await paymentInstructionFileProducer.CreatePaymentInstructionFile(records);
    IPaymentExport createdExport = await paymentExportRepository.Add(
      new PaymentExport()
      {
        CreatedAt = file.UploadedAt,
        FileUuid = file.UUID,
        EndDate = GetUtcDate(query.EndDate),
        StartDate = GetUtcDate(query.StartDate),
        Sha256 = file.Sha256
      });
    foreach (IPaymentRecord record in records)
    {
      record.PaymentExportUuid = createdExport.Uuid;
    }
    await paymentRecordService.UpdateMany(records);
    return createdExport.Uuid;
  }

  private long GetUtcDate(long unixDate)
  {
    return dateTimeProvider.DateTimeToUnix(dateTimeProvider.DateAsUtc(dateTimeProvider.UnixToDateTime(unixDate)).Date);
  }
}
