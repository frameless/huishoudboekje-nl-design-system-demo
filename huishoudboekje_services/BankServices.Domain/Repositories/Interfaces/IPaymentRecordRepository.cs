using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;

namespace BankServices.Domain.Repositories.Interfaces;

public interface IPaymentRecordRepository
{
  public Task<IList<IPaymentRecord>> GetAll(bool tracking, IPaymentRecordFilter? filter = null);
  public Task<IPaymentRecord> Add(IPaymentRecord data);
  public Task<IList<IPaymentRecord>> Add(IList<IPaymentRecord> data);

  public Task<IList<IPaymentRecord>> GetById(IList<string> ids);
  public Task<IList<IPaymentRecord>> GetExisting(IList<string> agreementIds, long from, long to);

  public Task<IList<IPaymentRecord>> GetIfExist(string agreementId, long processingDate);

  public Task<bool> Update(IList<IPaymentRecord> values);

  public Task<IList<IPaymentRecord>> GetNotExported();
  public Task<IList<IPaymentRecord>> GetNotExported(long from, long till);
}
