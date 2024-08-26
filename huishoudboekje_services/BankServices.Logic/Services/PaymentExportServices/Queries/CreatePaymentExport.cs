using BankServices.Logic.Services.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.Queries;

internal record CreatePaymentExport(IList<string> RecordIds, long StartDate, long EndDate) : IQuery<string>;
