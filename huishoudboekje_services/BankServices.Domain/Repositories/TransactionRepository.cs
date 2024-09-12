using BankServices.Domain.Contexts;
using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers;
using BankServices.Domain.Mappers.Interfaces;
using BankServices.Domain.Repositories.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using LinqKit;

namespace BankServices.Domain.Repositories;

public class TransactionRepository(BankServiceContext dbContext, ITransactionDbMapper mapper) : BaseRepository<Transaction>(dbContext), ITransactionRepository
{
  public async Task<Paged<ITransactionModel>> GetPaged(Pagination pagination, TransactionsFilter? filters)
  {
    OrderByCommandDecorator<Transaction> orderCommand =
      new(new GetAllCommand<Transaction>(), transaction => transaction.Date, true);


    PagedCommandDecorator<Transaction> pagedCommand = new(
      filters == null ? orderCommand : DecorateFilters(orderCommand, filters),
      pagination);
    return mapper.GetPagedCommunicationModels(await ExecuteCommand(pagedCommand));
  }

  public async Task<IList<ITransactionModel>> GetAll(TransactionsFilter? filters)
  {
    IDatabaseDecoratableCommand<Transaction> command = filters == null
      ? new GetAllCommand<Transaction>()
      : DecorateFilters(new GetAllCommand<Transaction>(), filters);
    return mapper.GetCommunicationModels(await ExecuteCommand(command));
  }

  public async Task<bool> UpdateIsReconciled(IList<string> queryIds, bool queryIsReconciled)
  {
    IList<Transaction> transactions = await ExecuteCommand(
      new GetMultipleByIdCommand<Transaction>(transaction => queryIds.Contains(transaction.Uuid.ToString())));

    foreach (Transaction transaction in transactions)
    {
      transaction.IsReconciled = queryIsReconciled;
    }

    await ExecuteCommand(new UpdateMultipleRecordsCommand<Transaction>(transactions));
    await SaveChangesAsync();
    return true;
  }

  private IDatabaseDecoratableCommand<Transaction> DecorateFilters(
    IDatabaseDecoratableCommand<Transaction> command,
    TransactionsFilter filters)
  {
    ExpressionStarter<Transaction>? predicate = PredicateBuilder.New<Transaction>(true);
    if (filters.IsReconciled != null)
    {
      predicate.And(transaction => transaction.IsReconciled == filters.IsReconciled);
    }
    if (filters.IsCredit != null)
    {
      predicate.And(transaction => transaction.IsCredit == filters.IsCredit);
    }
    if (filters.MinAmount != null)
    {
      predicate.And(transaction => transaction.Amount >= filters.MinAmount);
    }
    if (filters.MaxAmount != null)
    {
      predicate.And(transaction => transaction.Amount >= filters.MaxAmount);
    }
    if (filters.StartDate != null)
    {
      predicate.And(transaction => transaction.Date >= filters.StartDate);
    }
    if (filters.EndDate != null)
    {
      predicate.And(transaction => transaction.Date <= filters.EndDate);
    }
    if (filters.Ibans != null)
    {
      predicate.And(transaction => filters.Ibans.Contains(transaction.FromAccount));
    }
    if (filters.Ids != null)
    {
      predicate.And(transaction => filters.Ids.Contains(transaction.Uuid.ToString()));
    }
    if (filters.CustomerStatementMessageUuids != null)
    {
      predicate.And(transaction => filters.CustomerStatementMessageUuids.Contains(transaction.CustomerStatementMessageUuid.ToString()));
    }
    if (filters.KeyWords != null)
    {
      foreach (string word in filters.KeyWords)
      {
        predicate.And(transaction => transaction.InformationToAccountOwner.ToLower().Contains(word.ToLower()));
      }
    }
    return new WhereCommandDecorator<Transaction>(command, predicate);
  }
}
