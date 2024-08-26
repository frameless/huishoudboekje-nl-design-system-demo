using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using MassTransit;

namespace BankServices.MessageQueue.Consumers;

public class CheckPaymentInstructionsConsumer(IPaymentRecordService paymentRecordService, IDateTimeProvider dateTimeProvider) : IConsumer<CheckPaymentInstructionsMessage>
{
  public async Task Consume(ConsumeContext<CheckPaymentInstructionsMessage> context)
  {
    DateRange dateRange;
    if (context.Message.StartDate != null && context.Message.EndDate != null)
    {
      dateRange = new DateRange(
        dateTimeProvider.UnixToDateTime((long)context.Message.StartDate),
        dateTimeProvider.UnixToDateTime((long) context.Message.EndDate));
    }
    else
    {
      DateTime today = dateTimeProvider.Today();
      dateRange = new DateRange(today,today);
    }
    await paymentRecordService.CreatePaymentRecords(dateRange, null);
  }
}
