using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Interfaces;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.CsmServices.QueryHandlers;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;
using UploadCsmHandler = BankServices.Logic.Services.CsmServices.QueryHandlers.UploadCsmHandler;

namespace BankServices.Logic.Services.CsmServices;

public class CsmService(IFileProducer fileProducer, ISignalProducer signalProducer, ICsmRepository repository, INotificationProducer notificationProducer, IJournalEntryProducer journalEntryProducer, IPaymentRecordService paymentRecordService) : ICsmService
{
  public Task<IHhbFile> Upload(IHhbFile file)
  {
    UploadCsm uploadCsmQuery = new(file);
    UploadCsmHandler uploadCsmHandler = new(fileProducer);
    return uploadCsmHandler.HandleAsync(uploadCsmQuery);
  }

  public Task<Paged<ICsm>> GetPaged(Pagination pagination)
  {
    GetCsmPaged getCsmPagedQuery = new(pagination);
    GetCsmPagedHandler getCsmPagedHandler = new(repository, fileProducer);
    return getCsmPagedHandler.HandleAsync(getCsmPagedQuery);
  }

  public Task<ICsm> Create(ICsm csm)
  {
    CreateCsm createCsmQuery = new(csm);
    CreateCsmQueryHandler createCsmQueryHandler = new(repository);
    return createCsmQueryHandler.HandleAsync(createCsmQuery);
  }

  public Task<bool> TransactionReferenceExists(string transactionReference)
  {
    CheckTransactionReferenceExists checkQuery = new(transactionReference);
    CheckTransactionReferenceExistsHandler checkHandler = new(repository);
    return checkHandler.HandleAsync(checkQuery);
  }

  public Task<bool> Delete(string requestId)
  {
    DeleteCsm query = new(requestId);
    DeleteCsmQueryHandler handler = new(repository, fileProducer, signalProducer, notificationProducer, journalEntryProducer, paymentRecordService);
    return handler.HandleAsync(query);
  }
}
