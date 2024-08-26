using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.PaymentModels;
using MassTransit;

namespace BankServices.MessageQueue.Consumers;

public class MatchTransactionToPaymentRecordConsumer(IPaymentRecordService paymentRecordService) : IConsumer<MatchTransactionToRecordMessage>
{
  public async Task Consume(ConsumeContext<MatchTransactionToRecordMessage> context)
  {
    var info = context.Message.TransactionInfo;
    if (info != null && info.Count > 0)
    {
      await paymentRecordService.MatchTransactionsToPaymentRecords(info);
    }
  }
}
