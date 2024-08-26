using BankServices.Logic.Services.Interfaces;

namespace BankServices.Logic.Services.CsmServices.Queries;

public record DeleteCsm(string Id) : IQuery<bool>;
