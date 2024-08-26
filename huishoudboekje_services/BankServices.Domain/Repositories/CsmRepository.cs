using BankServices.Domain.Contexts;
using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers;
using BankServices.Domain.Mappers.Interfaces;
using BankServices.Domain.Repositories.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BankServices.Domain.Repositories;

public class CsmRepository(BankServiceContext dbContext, ICsmDbMapper mapper) : BaseRepository<CustomerStatementMessage>(dbContext), ICsmRepository
{
  public async Task<ICsm> Insert(ICsm value)
  {
    EntityEntry<CustomerStatementMessage> insertedAlarm =
      await ExecuteCommand(new InsertRecordCommand<CustomerStatementMessage>(mapper.GetDatabaseObject(value)));
    await SaveChangesAsync();
    return mapper.GetCommunicationModel(insertedAlarm.Entity);
  }

  public async Task<bool> CheckIfTransactionReferenceExists(string value)
  {
    List<CustomerStatementMessage> result = await ExecuteCommand(
        new NoTrackingCommandDecorator<CustomerStatementMessage>(
          new WhereCommandDecorator<CustomerStatementMessage>(new GetAllCommand<CustomerStatementMessage>(), csm => csm.TransactionReference.Equals(value))));
    return result.Count > 0;
  }

  public async Task<Paged<ICsm>> GetPaged(Pagination page)
  {
    PagedCommandDecorator<CustomerStatementMessage> pagedCommand = new(
      new IncludeCommandDecorator<CustomerStatementMessage>(
         new GetAllCommand<CustomerStatementMessage>(),
         csm => csm.Transactions),
         page);
    return mapper.GetPagedCommunicationModels(await ExecuteCommand(pagedCommand));
  }

  public Task SaveChanges()
  {
    return SaveChangesAsync();
  }

  public async Task<ICsm> GetByIdWithTransactions(string commandId)
  {
    List<CustomerStatementMessage> result = await ExecuteCommand(
      new IncludeCommandDecorator<CustomerStatementMessage>(
        new WhereCommandDecorator<CustomerStatementMessage>(
          new GetAllCommand<CustomerStatementMessage>(),
          t => t.Uuid.ToString().Equals(commandId)),
        csm => csm.Transactions));
    return mapper.GetCommunicationModel(result[0]);
  }

  public async Task<bool> DeleteNoSave(string requestId)
  {
    dbContext.Remove(await ExecuteCommand(new GetByIdCommand<CustomerStatementMessage>(Guid.Parse(requestId))));
    return true;
  }
}
