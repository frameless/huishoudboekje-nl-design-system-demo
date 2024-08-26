using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.Queries;

internal record DownloadPaymentExport(string PaymentExportId) : IQuery<IHhbFile>;
