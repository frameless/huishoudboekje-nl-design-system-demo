using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.Notifications;

namespace BankServices.Logic.Services.CsmServices.QueryHandlers;

public class DeleteCsmQueryHandler(ICsmRepository repository, IFileProducer fileProducer, ISignalProducer signalProducer,INotificationProducer notificationProducer, IJournalEntryProducer journalEntryProducer, IPaymentRecordService paymentRecordService) : IQueryHandler<DeleteCsm, bool>
{
  public async Task<bool> HandleAsync(DeleteCsm command)
  {
    ICsm csm = await repository.GetByIdWithTransactions(command.Id);
    bool deleted = await repository.DeleteNoSave(command.Id);
    if (deleted)
    {
      List<string> transactionIds = csm.Transactions.Select(transaction => transaction.UUID).ToList();
      IList<string> journalEntryUuids = await journalEntryProducer.Delete(transactionIds);
      await signalProducer.UpdateJournalEntryUuids(journalEntryUuids);
      await paymentRecordService.UnMatchTransactionsFromPaymentRecords(transactionIds);
      await fileProducer.Delete(csm.File.UUID);
      await repository.SaveChanges();
    }
    await Notify(csm.File, deleted);
    return deleted;
  }
  private Task Notify(IHhbFile file, bool deleted)
  {
    Notification message = new()
    {
      Message = "messages.csm.delete.message",
      Title = deleted ? "messages.csm.deleted.successTitle" : "messages.csm.deleted.failTitle",
      AdditionalProperties = new Dictionary<string, string>()
    };
    message.AdditionalProperties.Add("file", file.Name);
    return notificationProducer.Notify(message);
  }
}
