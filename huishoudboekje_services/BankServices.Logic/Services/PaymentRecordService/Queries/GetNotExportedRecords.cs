using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.Queries;

internal record GetNotExportedRecords(long from, long till) : IQuery<IList<IPaymentRecord>>
{
}
