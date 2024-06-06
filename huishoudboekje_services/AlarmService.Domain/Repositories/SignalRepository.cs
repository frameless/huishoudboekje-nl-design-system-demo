using AlarmService.Domain.Contexts;
using AlarmService.Domain.Mappers;
using AlarmService.Domain.Mappers.Interfaces;
using AlarmService.Domain.Repositories.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using LinqKit;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace AlarmService.Domain.Repositories;

public class SignalRepository(AlarmServiceContext dbContext) : BaseRepository<Signal>(dbContext), ISignalRepository
{
  private ISignalMapper _mapper = new SignalMapper();

  public async Task<ISignalModel> GetById(string id)
  {
    return _mapper.GetCommunicationModel(await ExecuteCommand(new GetByIdCommand<Signal>(Guid.Parse(id))));
  }

  public async Task<IList<ISignalModel>> GetMultipleByIds(IList<string> ids)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(new GetMultipleByIdCommand<Signal>(signal => ids.Contains(signal.Uuid.ToString()))));
  }

  public async Task<IList<ISignalModel>> GetAll(bool tracking, SignalFilterModel? filter = null)
  {
    IDatabaseDecoratableCommand<Signal> command =
      filter != null ? DecorateFilters(new GetAllCommand<Signal>(), filter) : new GetAllCommand<Signal>();
    if (!tracking)
    {
      command = new NoTrackingCommandDecorator<Signal>(command);
    }

    return _mapper.GetCommunicationModels(await ExecuteCommand(command));
  }

  public async Task<ISignalModel> Insert(ISignalModel value)
  {
    EntityEntry<Signal> insertedSignal =
      await ExecuteCommand(new InsertRecordCommand<Signal>(_mapper.GetDatabaseObject(value)));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(insertedSignal.Entity);
  }

  public async Task<bool> InsertMany(IList<ISignalModel> values)
  {
    bool inserted = await ExecuteCommand(new InsertMultipleRecordsCommand<Signal>(_mapper.GetDatabaseObjects(values)));
    await SaveChangesAsync();
    return inserted;
  }

  public async Task<ISignalModel> Update(ISignalModel value)
  {
    EntityEntry<Signal> signal =
      await ExecuteCommand(new UpdateRecordCommand<Signal>(_mapper.GetDatabaseObject(value)));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(signal.Entity);
  }

  public async Task<IList<ISignalModel>> GetByAlarmId(string alarmId)
  {
    throw new NotImplementedException();
  }

  public async Task<ISignalModel> SetIsActive(string id, bool isActive)
  {
    Signal signal = await ExecuteCommand(new GetByIdCommand<Signal>(Guid.Parse(id)));
    signal.IsActive = isActive;
    EntityEntry<Signal> updatedAlarm = await ExecuteCommand(new UpdateRecordCommand<Signal>(signal));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(updatedAlarm.Entity);
  }

  public async Task<Paged<ISignalModel>> GetPaged(Pagination pagination, SignalFilterModel? filter)
  {
    PagedCommandDecorator<Signal> pagedCommand = new(
      new OrderByCommandDecorator<Signal>(
        filter != null ? DecorateFilters(new GetAllCommand<Signal>(), filter) : new GetAllCommand<Signal>(),
        x => x.CreatedAt,
        desc: true),
      pagination);
    return _mapper.GetPagedCommunicationModels(await ExecuteCommand(pagedCommand));
  }

  public async Task<bool> Delete(string id)
  {
    bool result = await ExecuteCommand(
      new DeleteRecordDecorator<Signal>(
        new WhereCommandDecorator<Signal>(
          new NoTrackingCommandDecorator<Signal>(new GetAllCommand<Signal>()),
          signal => signal.Uuid.ToString() == id)));
    await SaveChangesAsync();
    return result;
  }

  public Task<int> GetActiveSignalsCount()
  {
    return Task.FromResult(
      ExecuteCommand(
        new WhereCommandDecorator<Signal>(
          new GetAllCommand<Signal>(),
          x => x.IsActive)).Result.Count());
  }

  public async Task<bool> DeleteByAlarmIds(IList<string> ids)
  {
    bool result = await ExecuteCommand(
      new DeleteRecordDecorator<Signal>(
        new WhereCommandDecorator<Signal>(
          new NoTrackingCommandDecorator<Signal>(new GetAllCommand<Signal>()),
          signal => ids.Contains(signal.AlarmUuid.ToString() ?? string.Empty))));

    return result;
  }

  public async Task<bool> DeleteByCitizenIds(IList<string> ids)
  {
    bool result = await ExecuteCommand(
      new DeleteRecordDecorator<Signal>(
        new WhereCommandDecorator<Signal>(
          new NoTrackingCommandDecorator<Signal>(new GetAllCommand<Signal>()),
          signal => ids.Contains(signal.CitizenUuid.ToString() ?? string.Empty))));

    return result;
  }

  private IDatabaseDecoratableCommand<Signal> DecorateFilters(
    IDatabaseDecoratableCommand<Signal> command,
    SignalFilterModel filter)
  {
    var predicate = PredicateBuilder.New<Signal>(true);
    if (filter.IsActive != null)
    {
      predicate.And(signal => signal.IsActive == filter.IsActive);
    }

    if (filter.AgreementIds is { Count: > 0 })
    {
      predicate.And(signal => filter.AgreementIds.Contains(signal.AgreementUuid.ToString()!));
    }

    if (filter.CitizenIds is { Count: > 0 })
    {
      predicate.And(signal => filter.CitizenIds.Contains(signal.CitizenUuid.ToString()!));
    }

    if (filter.AlarmIds is { Count: > 0 })
    {
      predicate.And(signal => filter.AlarmIds.Contains(signal.AlarmUuid.ToString()!));
    }

    if (filter.JournalEntryIds is { Count: > 0 })
    {
      predicate.And(
        signal => filter.JournalEntryIds.Any(journalEntryId => signal.JournalEntryUuids!.Contains(journalEntryId)));
    }

    if (filter.Ids is { Count : > 0 })
    {
      predicate.And(signal => filter.Ids.Contains(signal.Uuid.ToString()));
    }

    return new WhereCommandDecorator<Signal>(command, predicate);
  }
}
