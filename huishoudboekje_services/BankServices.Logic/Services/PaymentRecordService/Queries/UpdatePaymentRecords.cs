using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentRecordService.Queries;

public record UpdatePaymentRecords(IList<IPaymentRecord> Records) : IQuery<bool>;
