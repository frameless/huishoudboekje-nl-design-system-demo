using BankServices.Domain.Contexts;
using BankServices.Domain.Mappers;
using BankServices.Domain.Mappers.Interfaces;
using BankServices.Domain.Repositories.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using LinqKit;
using PaymentRecord = BankServices.Domain.Contexts.Models.PaymentRecord;

namespace BankServices.Domain.Repositories;

public class PaymentRecordRepository(BankServiceContext context, IDateTimeProvider dateTimeProvider)
  : BaseRepository<PaymentRecord>(context), IPaymentRecordRepository
{
  private IPaymentRecordMapper _mapper = new PaymentRecordMapper();

  public async Task<IList<IPaymentRecord>> GetAll(bool tracking, IPaymentRecordFilter? filter = null)
  {
    IDatabaseDecoratableCommand<PaymentRecord> command =
      filter != null ? DecorateFilters(new GetAllCommand<PaymentRecord>(), filter) : new GetAllCommand<PaymentRecord>();
    if (!tracking)
    {
      command = new NoTrackingCommandDecorator<PaymentRecord>(command);
    }

    return _mapper.GetCommunicationModels(await ExecuteCommand(command));
  }


  public async Task<IPaymentRecord> Add(IPaymentRecord data)
  {
    var inserted = await ExecuteCommand(new InsertRecordCommand<PaymentRecord>(_mapper.GetDatabaseObject(data)));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModel(inserted.Entity);
  }

  public async Task<IList<IPaymentRecord>> Add(IList<IPaymentRecord> data)
  {
    var items = _mapper.GetDatabaseObjects(data);
    bool inserted = await ExecuteCommand(new InsertMultipleRecordsCommand<PaymentRecord>(items));
    await SaveChangesAsync();
    return _mapper.GetCommunicationModels(items);
  }

  public async Task<IList<IPaymentRecord>> GetById(IList<string> ids)
  {
    List<PaymentRecord> models = await ExecuteCommand(
      new NoTrackingCommandDecorator<PaymentRecord>(new WhereCommandDecorator<PaymentRecord>(
      new GetAllCommand<PaymentRecord>(), record => ids.Contains(record.Uuid.ToString()))));
    return _mapper.GetCommunicationModels(models);
  }

  public async Task<IList<IPaymentRecord>> GetExisting(IList<string> agreementIds, long from, long to)
  {
    List<PaymentRecord> models = await ExecuteCommand(new WhereCommandDecorator<PaymentRecord>(
      new NoTrackingCommandDecorator<PaymentRecord>( new GetAllCommand<PaymentRecord>()), record =>
        agreementIds.Contains(record.AgreementUuid.ToString()) && record.OriginalProcessingDate >= from &&record.OriginalProcessingDate <= to
    ));

    return _mapper.GetCommunicationModels(models);
  }

  public async Task<IList<IPaymentRecord>> GetIfExist(string agreementId, long processingDate)
  {
    List<PaymentRecord> models = await ExecuteCommand(new WhereCommandDecorator<PaymentRecord>(
      new NoTrackingCommandDecorator<PaymentRecord>( new GetAllCommand<PaymentRecord>()), record =>
        record.AgreementUuid.ToString() == agreementId && record.OriginalProcessingDate == processingDate
    ));

    return _mapper.GetCommunicationModels(models);
  }

  public async Task<bool> Update(IList<IPaymentRecord> values)
  {
    bool inserted = await ExecuteCommand(new UpdateMultipleRecordsCommand<PaymentRecord>(_mapper.GetDatabaseObjects(values)));
    await SaveChangesAsync();
    return inserted;
  }

  public async Task<IList<IPaymentRecord>> GetNotExported()
  {
    List<PaymentRecord> models =
      await ExecuteCommand(new NoTrackingCommandDecorator<PaymentRecord>(
        new WhereCommandDecorator<PaymentRecord>(
          new GetAllCommand<PaymentRecord>(), record => record.PaymentExportUuid == null)));

    return _mapper.GetCommunicationModels(models);
  }

  public async Task<IList<IPaymentRecord>> GetNotExported(long from, long till)
  {
    List<PaymentRecord> models =
      await ExecuteCommand(new NoTrackingCommandDecorator<PaymentRecord>(
        new WhereCommandDecorator<PaymentRecord>(
          new GetAllCommand<PaymentRecord>(), record => record.PaymentExportUuid == null && (record.OriginalProcessingDate >= from && record.OriginalProcessingDate <= till))));

    return _mapper.GetCommunicationModels(models);
  }

  private IDatabaseDecoratableCommand<PaymentRecord> DecorateFilters(
    IDatabaseDecoratableCommand<PaymentRecord> command,
    IPaymentRecordFilter filter)
  {
    var predicate = PredicateBuilder.New<PaymentRecord>(true);
    if (filter.AgreementUuids != null)
    {
      predicate.And(record => filter.AgreementUuids.Contains(record.AgreementUuid.ToString()!));
    }

    if (filter.TransactionUuids != null)
    {
      predicate.And(record => filter.TransactionUuids.Contains(record.TransactionUuid.ToString()!));
    }

    if (filter.PaymentExportUuids != null)
    {
      predicate.And(record => filter.PaymentExportUuids.Contains(record.PaymentExportUuid.ToString()!));
    }

    if (filter.Reconciled != null)
    {
      predicate.And(record => record.Reconciled == filter.Reconciled);
    }

    if (filter.FromProcessingDate != null)
    {
      predicate.And(record => record.ProcessingDate >= filter.FromProcessingDate);
    }

    if (filter.ThroughProcessingDate != null)
    {
      predicate.And(record => record.ProcessingDate <= filter.ThroughProcessingDate);
    }

    if (filter.Exported != null)
    {
      if (filter.Exported == true)
      {
        predicate.And(record => record.PaymentExportUuid != null);
      }
      else
      {
        predicate.And(record => record.PaymentExportUuid == null);
      }
    }

    return new WhereCommandDecorator<PaymentRecord>(command, predicate);
  }

}
