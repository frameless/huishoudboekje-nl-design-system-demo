using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

public class UpdatePaymentRecordsQueryHandler(IPaymentRecordRepository paymentRecordRepository) : IQueryHandler<UpdatePaymentRecords, bool>
{
  public Task<bool> HandleAsync(UpdatePaymentRecords query)
  {
    return paymentRecordRepository.Update(query.Records);
  }
}
