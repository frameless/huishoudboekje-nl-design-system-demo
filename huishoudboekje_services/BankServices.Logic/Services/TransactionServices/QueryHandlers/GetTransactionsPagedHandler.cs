using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.TransactionServices.Queries;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.QueryHandlers;

internal class GetTransactionsPagedHandler(ITransactionRepository transactionRepository) : IQueryHandler<GetTransactionsPaged, Paged<ITransactionModel>>
{
  public Task<Paged<ITransactionModel>> HandleAsync(GetTransactionsPaged query)
  {
    return transactionRepository.GetPaged(query.Pagination, query.Filter);
  }
}
