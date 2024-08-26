using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Domain.Mappers;

public class PaymentRecordMapper : IPaymentRecordMapper
{
  public PaymentRecord GetDatabaseObject(IPaymentRecord communicationModel)
  {
    PaymentRecord dbo = new PaymentRecord()
    {
      Amount = communicationModel.Amount,
      AgreementUuid = Guid.Parse(communicationModel.AgreementUuid),
      CreatedAt = communicationModel.CreatedAt,
      ProcessingDate = communicationModel.ProcessingDate,
      OriginalProcessingDate = communicationModel.OriginalProcessingDate,
      AccountIban = communicationModel.AccountIban,
      AccountName = communicationModel.AccountName,
      Description = communicationModel.Description,
      Reconciled = communicationModel.Reconciled
    };

    if (communicationModel.TransactionUuid != null)
    {
      dbo.TransactionUuid = Guid.Parse(communicationModel.TransactionUuid);
    }

    if (communicationModel.UUID != null && communicationModel.UUID != "")
    {
      dbo.Uuid = Guid.Parse(communicationModel.UUID);
    }

    if (communicationModel.PaymentExportUuid != null)
    {
      dbo.PaymentExportUuid = Guid.Parse(communicationModel.PaymentExportUuid);
    }

    return dbo;
  }

  public IPaymentRecord GetCommunicationModel(PaymentRecord databaseObject)
  {
    IPaymentRecord communicationModel = new Core.CommunicationModels.PaymentModels.PaymentRecord()
    {
      UUID = databaseObject.Uuid.ToString(),
      AgreementUuid = databaseObject.AgreementUuid.ToString(),
      CreatedAt = databaseObject.CreatedAt,
      Amount = databaseObject.Amount,
      ProcessingDate = databaseObject.ProcessingDate,
      OriginalProcessingDate = databaseObject.OriginalProcessingDate,
      AccountIban = databaseObject.AccountIban,
      AccountName = databaseObject.AccountName,
      Description = databaseObject.Description,
      Reconciled = databaseObject.Reconciled
    };

    if (databaseObject.PaymentExportUuid != null)
    {
      communicationModel.PaymentExportUuid = databaseObject.PaymentExportUuid.ToString();
    }

    if (databaseObject.TransactionUuid != null)
    {
      communicationModel.TransactionUuid = databaseObject.TransactionUuid.ToString();
    }

    return communicationModel;
  }

  public IList<IPaymentRecord> GetCommunicationModels(IEnumerable<PaymentRecord> databaseObjects)
  {
    IList<IPaymentRecord> communicationModels = new List<IPaymentRecord>();
    foreach (PaymentRecord dbo in databaseObjects)
    {
      communicationModels.Add(GetCommunicationModel(dbo));
    }

    return communicationModels;
  }

  public IList<PaymentRecord> GetDatabaseObjects(IList<IPaymentRecord> communicationModels)
  {
    IList<PaymentRecord> records = new List<PaymentRecord>();
    foreach (IPaymentRecord record in communicationModels)
    {
      records.Add(GetDatabaseObject(record));
    }

    return records;
  }
}
