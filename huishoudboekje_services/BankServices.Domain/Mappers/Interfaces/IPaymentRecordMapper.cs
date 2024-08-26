using BankServices.Domain.Contexts.Models;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Domain.Mappers.Interfaces;

public interface IPaymentRecordMapper
{
  public PaymentRecord GetDatabaseObject(IPaymentRecord communicationModel);

  public IPaymentRecord GetCommunicationModel(PaymentRecord databaseObject);

  public IList<IPaymentRecord> GetCommunicationModels(IEnumerable<PaymentRecord> databaseObjects);

  public IList<PaymentRecord> GetDatabaseObjects(IList<IPaymentRecord> communicationModels);
}
