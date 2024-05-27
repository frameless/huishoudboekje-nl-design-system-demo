using Microsoft.AspNetCore.Http;
using UserApi.Services.Interfaces;

namespace UserApi.Services.AuthServices.Queries;

internal record IsValidToken(string Token, string? Ip) : IQuery<bool>;
