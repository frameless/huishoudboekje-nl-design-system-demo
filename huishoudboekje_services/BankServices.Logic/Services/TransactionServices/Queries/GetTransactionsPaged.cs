using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;

namespace BankServices.Logic.Services.TransactionServices.Queries;

internal record GetTransactionsPaged(Pagination Pagination, TransactionsFilter? Filter) : IQuery<Paged<ITransactionModel>>;
