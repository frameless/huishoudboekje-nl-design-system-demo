using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;
using LinqKit;

namespace BankServices.Grpc.Mappers;

public class TransactionGrpcMapper : ITransactionGrpcMapper
{
  public ITransactionModel GetCommunicationModel(TransactionData grpcModel)
  {
    return new TransactionModel()
    {
      Amount = grpcModel.Amount,
      CustomerStatementMessageUUID = grpcModel.CustomerStatementMessage,
      Date = grpcModel.Date,
      FromAccount = grpcModel.FromAccount,
      InformationToAccountOwner = grpcModel.InformationToAccountOwner,
      IsCredit = grpcModel.IsCredit,
      IsReconciled = grpcModel.IsReconciled,
      UUID = grpcModel.Id
    };
  }

  public IList<ITransactionModel> GetCommunicationModels(IList<TransactionData> grpcModels)
  {
    return grpcModels.Select(this.GetCommunicationModel).ToList();
  }

  public TransactionData GetGrpcModel(ITransactionModel communicationModel)
  {
    return new TransactionData()
    {
      Id = communicationModel.UUID,
      FromAccount = communicationModel.FromAccount,
      IsCredit = communicationModel.IsCredit,
      IsReconciled = communicationModel.IsReconciled,
      Date = communicationModel.Date,
      InformationToAccountOwner = communicationModel.InformationToAccountOwner,
      Amount = communicationModel.Amount,
      CustomerStatementMessage = communicationModel.CustomerStatementMessageUUID
    };
  }

  public Transactions GetGrpcModels(IList<ITransactionModel> communicationModels)
  {
    Transactions result = new Transactions();
    result.Data.AddRange(communicationModels.Select(this.GetGrpcModel));

    return result;
  }
}
