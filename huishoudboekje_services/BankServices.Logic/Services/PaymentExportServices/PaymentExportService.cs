using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.PaymentExportServices.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Queries;
using BankServices.Logic.Services.PaymentExportServices.QueryHandlers;
using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;

namespace BankServices.Logic.Services.PaymentExportServices;

public class PaymentExportService(
  IPaymentExportRepository paymentExportRepository,
  IPaymentRecordService paymentRecordService,
  ICreatePaymentInstructionFileProducer paymentInstructionFileProducer,
  IFileProducer fileProducer,
  IDateTimeProvider dateTimeProvider) : IPaymentExportService
{
  public Task<string> CreateExport(IList<string> recordIds, long startDate, long endDate)
  {
    CreatePaymentExport query = new(recordIds, startDate, endDate);
    CreatePaymentExportQueryHandler handler = new(paymentExportRepository, paymentRecordService, paymentInstructionFileProducer, dateTimeProvider);
    return handler.HandleAsync(query);
  }

  public Task<Paged<IPaymentExport>> GetPaged(Pagination page)
  {
    GetPaymentExportsPaged query = new(page);
    GetPaymentExportsPagedQueryHandler handler = new(paymentExportRepository);
    return handler.HandleAsync(query);
  }

  public Task<IHhbFile> GetFile(string requestId)
  {
    DownloadPaymentExport query = new(requestId);
    DownloadPaymentRecordQueryHandler handler = new(paymentExportRepository, fileProducer);
    return handler.HandleAsync(query);
  }

  public Task<IPaymentExport> Get(string exportId)
  {
    GetExport query = new(exportId);
    GetExportQueryHandler handler = new(paymentExportRepository);
    return handler.HandleAsync(query);
  }
}
