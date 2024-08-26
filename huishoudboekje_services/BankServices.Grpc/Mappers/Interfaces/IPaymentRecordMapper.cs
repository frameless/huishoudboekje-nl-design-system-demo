using BankService_RPC;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Grpc.Mappers.Interfaces;

public interface IPaymentRecordMapper
{
  public IPaymentRecord GetCommunicationModel(PaymentRecord grpcModel);

  public IList<IPaymentRecord> GetCommunicationModels(IList<PaymentRecord> grpcModels);

  public PaymentRecord GetGrpcModel(IPaymentRecord communicationModel);
  public PaymentRecords GetGrpcModels(IList<IPaymentRecord> communicationModels);
}
