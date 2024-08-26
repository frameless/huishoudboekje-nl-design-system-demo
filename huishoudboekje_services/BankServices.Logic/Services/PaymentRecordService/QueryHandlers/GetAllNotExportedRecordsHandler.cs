using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

internal class GetAllNotExportedRecordsHandler(IPaymentRecordRepository _paymentRecordRepository) : IQueryHandler<GetAllNotExportedRecords, IList<IPaymentRecord>>
{

  public async Task<IList<IPaymentRecord>> HandleAsync(GetAllNotExportedRecords query)
  {
    return await _paymentRecordRepository.GetNotExported();
  }
}
