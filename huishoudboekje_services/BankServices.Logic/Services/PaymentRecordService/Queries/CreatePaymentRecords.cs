using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;

namespace BankServices.Logic.Services.PaymentRecordService.Queries;

internal record CreatePaymentRecords(DateRange DateRange, long? ProcessAt = null) : IQuery<IList<IPaymentRecord>>
{

}
