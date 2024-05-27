using UserApi.Services.Interfaces;

namespace UserApi.Services.BsnServices.Queries;

internal record ValidateBsn(string Bsn) : IQuery<bool>;
