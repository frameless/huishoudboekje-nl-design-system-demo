using System.Text;
using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;
using FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03;
using Receiver = FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03.Receiver;
using Sender = FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03.Sender;

namespace FileServices.Logic.FileGenerators.PaymentInstructionsExport;

//Generates pain.001 files
public class SepaGenerator(IDateTimeProvider dateTimeProvider) : IPaymentInstructionsExportGenerator
{
  private int controlSum = 0;

  public Task<byte[]> Generate(IList<IPaymentRecord> records, ConfigurationAccountConfig config)
  {
    Pain_001_001_03_Generator generator = new(defaultSender: new Sender(config.Name, config.Iban, config.Bic));
    foreach (IPaymentRecord record in records)
    {
      generator.AddPaymentInformation(RecordToPaymentInfo(record));
    }

    string file = generator.Generate(config.Name, CurrencyAmountAsDecimal(controlSum));
    return Task.FromResult(Encoding.UTF8.GetBytes(file));
  }

  private PaymentInformation RecordToPaymentInfo(IPaymentRecord record)
  {
    int absoluteAmount = Math.Abs(record.Amount);
    decimal amountAsDecimal = CurrencyAmountAsDecimal(absoluteAmount);
    controlSum += absoluteAmount;
    return new PaymentInformation(
      dateTimeProvider.UnixToDateTime(record.ProcessingDate),
      [
        new TransactionInformation(
          Guid.NewGuid().ToString("N"),
          amountAsDecimal,
          new Receiver(record.AccountName, record.AccountIban),
          record.Description)
      ],
      amountAsDecimal);
  }

  private static decimal CurrencyAmountAsDecimal(int amount)
  {
    return (decimal)amount / 100;
  }
}
