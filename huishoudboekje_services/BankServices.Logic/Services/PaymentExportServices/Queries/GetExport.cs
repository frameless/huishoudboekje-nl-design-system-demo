using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Logic.Services.PaymentExportServices.Queries;

internal record GetExport(string Id) : IQuery<IPaymentExport>;
