using BankServices.Logic.Services.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Queries;

internal record CheckTransactionReferenceExists(string transactionReference) : IQuery<bool>;
