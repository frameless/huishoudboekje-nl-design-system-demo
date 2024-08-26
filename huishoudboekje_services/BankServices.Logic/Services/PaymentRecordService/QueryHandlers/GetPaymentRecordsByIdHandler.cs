using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

internal class GetPaymentRecordsByIdHandler(IPaymentRecordRepository _paymentRecordRepository) : IQueryHandler<GetPaymentRecordsById, IList<IPaymentRecord>>
{
  public Task<IList<IPaymentRecord>> HandleAsync(GetPaymentRecordsById query)
  {
    return _paymentRecordRepository.GetById(query.Ids);
  }
}
