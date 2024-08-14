using AlarmService.Logic.Services.Interfaces;
using Core.CommunicationModels.JournalEntryModel.Interfaces;

namespace AlarmService.Logic.Services.EvaluationServices.Queries;

internal record EvaluateReconciliatedJournalEntries(
  IDictionary<string, string> AgreementAlarms,
  IList<IJournalEntryModel> ReconcilliatedEntries,
  IDictionary<string, string> AlarmToCitizen) : IQuery<bool>;
