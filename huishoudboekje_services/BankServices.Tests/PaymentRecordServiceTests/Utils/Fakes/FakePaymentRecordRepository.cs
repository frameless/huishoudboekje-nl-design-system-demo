using BankServices.Domain.Repositories.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Tests.PaymentRecordServiceTests.Utils.Fakes;

public class FakePaymentRecordRepository : IPaymentRecordRepository
{
  private IList<IPaymentRecord> database = new List<IPaymentRecord>();


  public async Task<IList<IPaymentRecord>> GetAll(bool tracking, IPaymentRecordFilter? filter = null)
  {
    if (filter != null)
    {
      return Filter(filter);
    }
    else
    {
      return database;
    }
  }

  public async Task<IPaymentRecord> Add(IPaymentRecord data)
  {
    data.UUID = Guid.NewGuid().ToString();
    return data;
  }

  public async Task<IList<IPaymentRecord>> Add(IList<IPaymentRecord> data)
  {
    foreach (var entry in data)
    {
      entry.UUID = Guid.NewGuid().ToString();
    }

    return data;
  }

  public async Task<IList<IPaymentRecord>> GetById(IList<string> ids)
  {
    return database.Where(record => ids.Contains(record.UUID)).ToList();
  }

  public async Task<IList<IPaymentRecord>> GetExisting(IList<string> agreementIds, long from, long to)
  {
    return database
      .Where(record => agreementIds.Contains(record.AgreementUuid) && record.OriginalProcessingDate >= from && record.OriginalProcessingDate <= to).ToList();;
  }

  public async Task<IList<IPaymentRecord>> GetIfExist(string agreementId, long processingDate)
  {
    return database
      .Where(record => record.AgreementUuid == agreementId && record.OriginalProcessingDate == processingDate).ToList();
  }

  public async Task<bool> Update(IList<IPaymentRecord> values)
  {
    foreach (var updateValue in values)
    {
      if (database.Any(value => value.UUID == updateValue.UUID))
      {
        var prev = database.Where(value => value.UUID == updateValue.UUID).First();
        database[database.IndexOf(prev)] = updateValue;
      }
    }

    return true;
  }

  public async Task<IList<IPaymentRecord>> GetNotExported()
  {
    return database.Where(record => record.PaymentExportUuid == null).ToList();
  }

  public async Task<IList<IPaymentRecord>> GetNotExported(long from, long till)
  {
    return database.Where(record => record.PaymentExportUuid == null && record.OriginalProcessingDate >= from &&
                                    record.OriginalProcessingDate <= till).ToList();
  }

  public void SetCurrentDatabaseRecords(IList<IPaymentRecord> values)
  {
    this.database = values;
  }

  private IList<IPaymentRecord> Filter(
    IPaymentRecordFilter filter)
  {
    var result = database;
    if (filter.AgreementUuids != null)
    {
      result = result.Where(record => filter.AgreementUuids.Contains(record.AgreementUuid.ToString()!)).ToList();
    }

    if (filter.TransactionUuids != null)
    {
      result = result.Where(record => filter.TransactionUuids.Contains(record?.TransactionUuid?.ToString()!)).ToList();
    }

    if (filter.PaymentExportUuids != null)
    {
      result = result.Where(record => filter.PaymentExportUuids.Contains(record?.PaymentExportUuid?.ToString()!)).ToList();
    }

    if (filter.Reconciled != null)
    {
      result = result.Where(record => record.Reconciled == filter.Reconciled).ToList();
    }

    if (filter.FromProcessingDate != null)
    {
      result = result.Where(record => record.ProcessingDate >= filter.FromProcessingDate).ToList();
    }

    if (filter.ThroughProcessingDate != null)
    {
      result = result.Where(record => record.ProcessingDate <= filter.ThroughProcessingDate).ToList();
    }

    if (filter.Exported != null)
    {
      if (filter.Exported == true)
      {
        result = result.Where(record => record.PaymentExportUuid != null).ToList();
      }
      else
      {
        result = result.Where(record => record.PaymentExportUuid == null).ToList();
      }
    }

    return result;
  }
}
