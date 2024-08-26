using Core.CommunicationModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Domain.Repositories.Interfaces;

public interface IPaymentExportRepository
{
  public Task<IPaymentExport> Add(IPaymentExport data);
  Task<Paged<IPaymentExport>> GetPaged(Pagination queryPagination);

  Task<IPaymentExport> GetById(string queryPaymentExportId, bool includeRecords = false);
}
