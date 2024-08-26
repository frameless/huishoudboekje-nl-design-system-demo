using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;

namespace BankServices.Logic.Services.CsmServices.Queries;

public record CreateCsm(ICsm Csm) : IQuery<ICsm>;
