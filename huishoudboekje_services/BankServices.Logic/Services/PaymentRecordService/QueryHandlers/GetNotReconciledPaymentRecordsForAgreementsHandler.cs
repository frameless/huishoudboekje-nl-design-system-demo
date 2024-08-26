using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

public class GetNotReconciledPaymentRecordsForAgreementsHandler(IPaymentRecordRepository _paymentRecordRepository) : IQueryHandler<GetNotReconciledPaymentRecordsForAgreements, IList<IPaymentRecord>>
{
  public async Task<IList<IPaymentRecord>> HandleAsync(GetNotReconciledPaymentRecordsForAgreements query)
  {
    return await _paymentRecordRepository.GetAll(false,
      new PaymentRecordFilter() { AgreementUuids = query.AgreementIds , Reconciled = false, Exported = true});
  }
}
