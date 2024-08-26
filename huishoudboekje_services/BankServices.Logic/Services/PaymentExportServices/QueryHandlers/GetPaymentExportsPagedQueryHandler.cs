using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Queries;
using Core.CommunicationModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.QueryHandlers;

internal class GetPaymentExportsPagedQueryHandler(IPaymentExportRepository repository) : IQueryHandler<GetPaymentExportsPaged, Paged<IPaymentExport>>
{
  public Task<Paged<IPaymentExport>> HandleAsync(GetPaymentExportsPaged query)
  {
    return repository.GetPaged(query.Pagination);
  }
}
