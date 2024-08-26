using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Tests.PaymentRecordServiceTests.Utils.Factories;

public class PaymentRecordFactory
{
  public IList<IPaymentRecord> CreatePaymentRecords(int amount, int transactionAmount, long processingDate)
  {
    var result = new List<IPaymentRecord>();
    var random = new Random();
    for (int i = 0; i < amount; i++)
    {

      result.Add(new PaymentRecord()
      {
        AgreementUuid = Guid.NewGuid().ToString(),
        Amount = transactionAmount,
        CreatedAt = processingDate,
        OriginalProcessingDate = processingDate,
        PaymentExportUuid = null,
        ProcessingDate = processingDate,
        UUID = Guid.NewGuid().ToString(),
        Reconciled = false,
        TransactionUuid = null
      });
    }

    return result;
  }

  public IList<IPaymentRecord> CreatePaymentRecords(int amount, int transactionAmount, long processingDate, string exportUuid)
  {
    var result = new List<IPaymentRecord>();
    var random = new Random();
    for (int i = 0; i < amount; i++)
    {
      result.Add(new PaymentRecord()
      {
        AgreementUuid = Guid.NewGuid().ToString(),
        Amount = transactionAmount,
        CreatedAt = processingDate,
        OriginalProcessingDate = processingDate,
        PaymentExportUuid = exportUuid,
        ProcessingDate = processingDate,
        UUID = Guid.NewGuid().ToString(),
        Reconciled = false,
        TransactionUuid = null
      });
    }

    return result;
  }

  public IList<IPaymentRecord> CreatePaymentRecords(int amount, int transactionAmount, long processingDate, string exportUuid, string[] transactionUuid)
  {
    if (transactionUuid.Length < amount - 1)
      throw new IndexOutOfRangeException("less transaction uuids given then amount to create");
    var result = new List<IPaymentRecord>();
    var random = new Random();
    for (int i = 0; i < amount; i++)
    {
      result.Add(new PaymentRecord()
      {
        AgreementUuid = Guid.NewGuid().ToString(),
        Amount = transactionAmount,
        CreatedAt = processingDate,
        OriginalProcessingDate = processingDate,
        PaymentExportUuid = exportUuid,
        ProcessingDate = processingDate,
        UUID = Guid.NewGuid().ToString(),
        Reconciled = true,
        TransactionUuid = transactionUuid[i]
      });
    }

    return result;
  }


  public IList<IPaymentRecord> Combine(params IList<IPaymentRecord>[] lists)
  {
    var result = new List<IPaymentRecord>();
    foreach (var list in lists)
    {
      result.AddRange(list);
    }

    return result;
  }
}
