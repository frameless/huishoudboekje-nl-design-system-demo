using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Queries;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.ErrorHandling.Exceptions;

namespace BankServices.Logic.Services.PaymentExportServices.QueryHandlers;

internal class DownloadPaymentRecordQueryHandler(IPaymentExportRepository repository, IFileProducer fileProducer) : IQueryHandler<DownloadPaymentExport, IHhbFile>
{
  public async Task<IHhbFile> HandleAsync(DownloadPaymentExport query)
  {
    IPaymentExport export = await repository.GetById(query.PaymentExportId);
    IList<IHhbFile> files = await fileProducer.GetFiles([export.FileUuid]);
    if (files.Count != 1)
    {
      throw new HHBDataException(
        "Received multiple or no files when one was expected",
        "Received multiple or no files when one was expected");
    }

    return files[0];
  }
}
