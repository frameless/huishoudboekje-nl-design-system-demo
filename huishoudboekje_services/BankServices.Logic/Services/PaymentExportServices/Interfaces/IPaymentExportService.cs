using Core.CommunicationModels;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.Interfaces;

public interface IPaymentExportService
{
  public Task<string> CreateExport(IList<string> recordIds, long startDate, long endDate);

  Task<Paged<IPaymentExport>> GetPaged(Pagination page);

  Task<IHhbFile> GetFile(string requestId);
  Task<IPaymentExport> Get(string exportId);
}
