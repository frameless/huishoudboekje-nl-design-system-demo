using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using BankServices.Logic.Services.TransactionServices.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;
using Grpc.Core;

namespace BankServices.Grpc.Controllers;

public class TransactionController(ITransactionService transactionService, ITransactionGrpcMapper mapper) : Transaction.TransactionBase
{
  public override async Task<Transactions> GetByIds(GetByIdsRequest request, ServerCallContext context)
  {
    IList<string> ids = request.Ids.ToList();
    IList<ITransactionModel> transactions = await transactionService.GetAll(new TransactionsFilter() { Ids = ids });
    return mapper.GetGrpcModels(transactions.OrderBy( transaction => ids.IndexOf(transaction.UUID)).ToList());
  }
}
