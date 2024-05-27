using UserApi.Services.Interfaces;

namespace UserApi.Services.BsnServices.Queries;

internal record IsBsnAllowed(string Bsn) : IQuery<bool>;
