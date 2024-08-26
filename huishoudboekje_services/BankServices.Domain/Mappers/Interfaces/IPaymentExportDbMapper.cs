using BankServices.Domain.Contexts.Models;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Domain.Mappers.Interfaces;

public interface IPaymentExportDbMapper
{
  public PaymentExport GetDatabaseObject(IPaymentExport communicationModel);

  public IPaymentExport GetCommunicationModel(PaymentExport databaseObject);

  public IList<IPaymentExport> GetCommunicationModels(IList<PaymentExport> databaseObjects);
}
