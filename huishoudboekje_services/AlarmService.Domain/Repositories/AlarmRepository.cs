using System.Linq.Expressions;
using System.Reflection;
using AlarmService.Domain.Contexts;
using AlarmService.Domain.Mappers;
using AlarmService.Domain.Mappers.Interfaces;
using AlarmService.Domain.Repositories.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.ErrorHandling.Exceptions;
using Grpc.Core;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace AlarmService.Domain.Repositories;

public class AlarmRepository(AlarmServiceContext dbContext) : BaseRepository<Alarm>(dbContext), IAlarmRepository
{
  private IAlarmMapper _mapper = new AlarmMapper();

  public async Task<IAlarmModel> GetById(string id)
  {
    return _mapper.GetCommunicationModel(await ExecuteCommand(new GetByIdCommand<Alarm>(Guid.Parse(id))));
  }

  public async Task<IList<IAlarmModel>> GetMultipleByIds(IList<string> ids)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        new NoTrackingCommandDecorator<Alarm>(
          new GetMultipleByIdCommand<Alarm>(alarm => ids.Contains(alarm.Uuid.ToString())))));
  }


  public async Task<IList<IAlarmModel>> GetMultipleActiveByIds(IList<string> ids)
  {
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        new NoTrackingCommandDecorator<Alarm>(
          new WhereCommandDecorator<Alarm>(
            new GetAllCommand<Alarm>(),
            alarm => alarm.IsActive && ids.Contains(alarm.Uuid.ToString())))));
  }

  public async Task<IList<IAlarmModel>> GetActiveByCheckOnDateBeforeNoTracking(DateTime date)
  {
    long unixTimeDate = ((DateTimeOffset)date).ToUnixTimeSeconds();
    return _mapper.GetCommunicationModels(
      await ExecuteCommand(
        new NoTrackingCommandDecorator<Alarm>(
          new WhereCommandDecorator<Alarm>(new GetAllCommand<Alarm>(), alarm => alarm.IsActive && alarm.CheckOnDate <= unixTimeDate))));
  }

  public async Task<IAlarmModel> InsertWithoutSave(IAlarmModel value)
  {
    EntityEntry<Alarm> insertedAlarm =
      await ExecuteCommand(new InsertRecordCommand<Alarm>(_mapper.GetDatabaseObject(value)));
    return _mapper.GetCommunicationModel(insertedAlarm.Entity);
  }

  public async Task<bool> DeleteByIds(IList<string> ids)
  {
    bool success = await ExecuteCommand(
      new DeleteRecordDecorator<Alarm>(
        new NoTrackingCommandDecorator<Alarm>(
          new WhereCommandDecorator<Alarm>(new GetAllCommand<Alarm>(), alarm => ids.Contains(alarm.Uuid.ToString())))));

    return success;
  }

  public Task SaveChanges()
  {
    return SaveChangesAsync();
  }

  public async Task<IAlarmModel> Update(UpdateModel value)
  {
    Alarm alarm = await ExecuteCommand(new GetByIdCommand<Alarm>(Guid.Parse(value.Uuid)));

    //TODO make generic?
    foreach (var update in value.Updates)
    {
      PropertyInfo? property = alarm.GetType().GetProperty(
        update.Key,
        BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public);
      if (property == null)
      {
        throw new HHBInvalidInputException(
          $"Invalid alarm property {update.Key} given",
          "Could not update alarm",
          StatusCode.InvalidArgument);
      }

      property.SetValue(alarm, update.Value);
    }

    EntityEntry<Alarm> updatedAlarm = await ExecuteCommand(new UpdateRecordCommand<Alarm>(alarm));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(updatedAlarm.Entity);
  }

  public async Task<bool> UpdateMany(IList<IAlarmModel> values)
  {
    bool inserted = await ExecuteCommand(new UpdateMultipleRecordsCommand<Alarm>(_mapper.GetDatabaseObjects(values)));
    await SaveChangesAsync();
    return inserted;
  }

  public async Task<IAlarmModel> SetIsActive(string id, bool isActive)
  {
    Alarm alarm = await ExecuteCommand(new GetByIdCommand<Alarm>(Guid.Parse(id)));
    alarm.IsActive = isActive;
    EntityEntry<Alarm> updatedAlarm = await ExecuteCommand(new UpdateRecordCommand<Alarm>(alarm));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(updatedAlarm.Entity);
  }

  public async Task<bool> Delete(string id)
  {
    dbContext.Remove(await ExecuteCommand(new GetByIdCommand<Alarm>(Guid.Parse(id))));
    await SaveChangesAsync();
    return true;
  }
}
