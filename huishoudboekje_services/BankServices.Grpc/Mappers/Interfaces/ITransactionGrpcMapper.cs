using BankService_RPC;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Grpc.Mappers.Interfaces;

public interface ITransactionGrpcMapper
{
  public ITransactionModel GetCommunicationModel(TransactionData grpcModel);

  public IList<ITransactionModel> GetCommunicationModels(IList<TransactionData> grpcModels);

  public TransactionData GetGrpcModel(ITransactionModel communicationModel);
  public Transactions GetGrpcModels(IList<ITransactionModel> communicationModels);
}
