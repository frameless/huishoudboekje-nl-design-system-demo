using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using PaymentRecord = Core.CommunicationModels.PaymentModels.PaymentRecord;

namespace BankServices.Domain.Mappers;

public class PaymentExportDbMapper() : IPaymentExportDbMapper
{
  private IPaymentRecordMapper _recordMapper = new PaymentRecordMapper();

  public PaymentExport GetDatabaseObject(IPaymentExport communicationModel)
  {
    PaymentExport dbo = new()
    {
      CreatedAt = communicationModel.CreatedAt,
      EndDate = communicationModel.EndDate,
      StartDate = communicationModel.StartDate,
      FileUuid = Guid.Parse(communicationModel.FileUuid),
      Sha256 = communicationModel.Sha256
    };
    if (communicationModel.Uuid != null && communicationModel.Uuid != "")
    {
      dbo.Uuid = Guid.Parse(communicationModel.Uuid);
    }

    return dbo;
  }

  public IPaymentExport GetCommunicationModel(PaymentExport databaseObject)
  {
    return new Core.CommunicationModels.PaymentModels.PaymentExport()
    {
      CreatedAt = databaseObject.CreatedAt,
      EndDate = databaseObject.EndDate,
      StartDate = databaseObject.StartDate,
      FileUuid = databaseObject.FileUuid.ToString(),
      Sha256 = databaseObject.Sha256,
      Uuid = databaseObject.Uuid.ToString(),
      Records = _recordMapper.GetCommunicationModels(databaseObject.Records)
    };
  }

  public IList<IPaymentExport> GetCommunicationModels(IList<PaymentExport> databaseObjects)
  {
    return databaseObjects.Select(GetCommunicationModel).ToList();
  }
}
