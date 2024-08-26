using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using PaymentExportRecordsInfo = BankService_RPC.PaymentExportRecordsInfo;

namespace BankServices.Grpc.Mappers;

public class PaymentExportGrpcMapper : IPaymentExportGrpcMapper
{
  public IList<PaymentExportData> GetGrpcObjects(IList<IPaymentExport> exports)
  {
    return exports.Select(export => GetGrpcObject(export)).ToList();
  }
  public PaymentExportData GetGrpcObject(IPaymentExport export, bool mapRecords = false)
  {
    PaymentExportData result = new()
    {
      Id = export.Uuid,
      CreatedAt = export.CreatedAt,
      EndDate = export.EndDate,
      StartDate = export.StartDate,
      File = new PaymentExportFileData()
      {
        Id = export.FileUuid,
        Sha256= export.Sha256
      }
    };
    if (export.Records != null && export.Records.Count != 0)
    {
      result.RecordsInfo = new PaymentExportRecordsInfo()
      {
        Count = export.Records.Count,
        TotalAmount = Math.Abs(export.Records.Sum(record => record.Amount)),
      };
      result.RecordsInfo.ProcessingDates.AddRange(export.Records.Select(record => record.ProcessingDate).Distinct());
    }
    else
    {
      result.RecordsInfo = new PaymentExportRecordsInfo()
      {
        Count = 0,
        TotalAmount = 0
      };
    }

    if (!mapRecords || export.Records == null) return result;
    {
      IList<PaymentExportRecordData> mappedRecords = [];
      foreach (IPaymentRecord record in export.Records)
      {
        mappedRecords.Add(MapPaymentExportRecord(record));
      }

      result.Records.AddRange(mappedRecords);
    }

    return result;
  }

  private PaymentExportRecordData MapPaymentExportRecord(IPaymentRecord record)
  {
    return new PaymentExportRecordData()
    {
      CreatedAt = record.CreatedAt,
      AccountIban = record.AccountIban,
      AccountName = record.AccountName,
      AgreementUuid = record.AgreementUuid,
      OriginalProcessingDate = record.OriginalProcessingDate,
      Amount = record.Amount,
      Id = record.UUID,
      ProcessAt = record.ProcessingDate
    };
  }

}
