using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.Queries;

internal record GetTransactions(TransactionsFilter? Filter) : IQuery<IList<ITransactionModel>>;
