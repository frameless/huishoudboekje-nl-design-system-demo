using BankServices.Logic.Services.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.Queries;

internal record UpdateIsReconciled(IList<string> Ids, bool IsReconciled) : IQuery<bool>;
