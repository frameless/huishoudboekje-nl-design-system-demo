using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.PaymentModels;
using MassTransit;

namespace BankServices.MessageQueue.Consumers;

public class UnMatchTransactionToPaymentRecordConsumer(IPaymentRecordService paymentRecordService) : IConsumer<UnMatchTransactionFromRecordMessage>
{
  public async Task Consume(ConsumeContext<UnMatchTransactionFromRecordMessage> context)
  {
    IList<string> ids = context.Message.TransactionIds;
    if (ids != null && ids.Count > 0)
    {
      await paymentRecordService.UnMatchTransactionsFromPaymentRecords(ids);
    }
  }
}
