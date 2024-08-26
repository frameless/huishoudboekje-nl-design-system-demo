using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Queries;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.QueryHandlers;

internal class GetExportQueryHandler(IPaymentExportRepository repository) : IQueryHandler<GetExport, IPaymentExport>
{
  public Task<IPaymentExport> HandleAsync(GetExport query)
  {
    return repository.GetById(query.Id, includeRecords:true);
  }
}
