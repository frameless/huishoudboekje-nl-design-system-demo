using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

internal class GetNotExportedRecordsHandler(IPaymentRecordRepository _paymentRecordRepository) : IQueryHandler<GetNotExportedRecords, IList<IPaymentRecord>>
{

  public async Task<IList<IPaymentRecord>> HandleAsync(GetNotExportedRecords query)
  {
    return await _paymentRecordRepository.GetNotExported(query.from, query.till);
  }
}
