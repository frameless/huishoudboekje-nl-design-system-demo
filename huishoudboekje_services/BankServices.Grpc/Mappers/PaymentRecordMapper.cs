using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Grpc.Mappers;

public class PaymentRecordMapper : IPaymentRecordMapper
{
  public IPaymentRecord GetCommunicationModel(PaymentRecord grpcModel)
  {
    IPaymentRecord result = new Core.CommunicationModels.PaymentModels.PaymentRecord()
    {
      Amount = grpcModel.Amount,
      AgreementUuid = grpcModel.AgreementUuid,
      CreatedAt = grpcModel.CreatedAt,
      UUID = grpcModel.Id,
      ProcessingDate = grpcModel.ProcessAt,
      AccountName = grpcModel.AccountName,
      AccountIban = grpcModel.AccountIban
    };

    if (grpcModel.HasPaymentExportUuid)
    {
      result.PaymentExportUuid = grpcModel.PaymentExportUuid;
    }
    return result;
  }

  public IList<IPaymentRecord> GetCommunicationModels(IList<PaymentRecord> grpcModels)
  {
    IList<IPaymentRecord> records = new List<IPaymentRecord>();
    foreach (PaymentRecord grpcModel in grpcModels)
    {
      records.Add(GetCommunicationModel(grpcModel));
    }

    return records;
  }

  public PaymentRecord GetGrpcModel(IPaymentRecord communicationModel)
  {
    PaymentRecord record = new PaymentRecord()
    {
      AgreementUuid = communicationModel.AgreementUuid,
      Amount = communicationModel.Amount,
      CreatedAt = communicationModel.CreatedAt,
      Id = communicationModel.UUID,
      ProcessAt = communicationModel.ProcessingDate,
      OriginalProcessingDate = communicationModel.OriginalProcessingDate,
      AccountName = communicationModel.AccountName,
      AccountIban = communicationModel.AccountIban
    };

    if (communicationModel.PaymentExportUuid != null)
    {
      record.PaymentExportUuid = communicationModel.PaymentExportUuid;
    }

    return record;
  }

  public PaymentRecords GetGrpcModels(IList<IPaymentRecord> communicationModels)
  {
    IList<PaymentRecord> grpcModels = new List<PaymentRecord>();
    PaymentRecords paymentRecords = new PaymentRecords();


    foreach (IPaymentRecord record in communicationModels)
    {
      grpcModels.Add(GetGrpcModel(record));
    }

    paymentRecords.Data.AddRange(grpcModels);
    return paymentRecords;
  }
}
