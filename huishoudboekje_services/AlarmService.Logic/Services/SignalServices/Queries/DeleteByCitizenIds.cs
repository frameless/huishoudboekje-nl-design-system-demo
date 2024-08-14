using AlarmService.Logic.Services.Interfaces;

namespace AlarmService.Logic.Services.SignalServices.Queries;

internal record DeleteByCitizenIds(IList<string> Ids) : IQuery<bool>;
