using AlarmService.Logic.Services.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.Queries;

internal record EvaluateCitizenSaldo(IList<string> CitizenUuids, int Threshold) : IQuery<bool>;
