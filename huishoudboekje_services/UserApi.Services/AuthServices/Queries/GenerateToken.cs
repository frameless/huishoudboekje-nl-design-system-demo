using UserApi.Services.Interfaces;

namespace UserApi.Services.AuthServices.Queries;

internal record GenerateToken(string? IpAddress, string? Key) : IQuery<string>;
