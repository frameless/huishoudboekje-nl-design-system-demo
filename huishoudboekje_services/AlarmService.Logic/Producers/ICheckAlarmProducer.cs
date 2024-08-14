using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.utils.DataTypes;

namespace AlarmService.Logic.Producers;

public interface ICheckAlarmProducer
{
  // Until this can be moved to msq producer
  public Task<Dictionary<string, IList<IJournalEntryModel>>> RequestJournalEntriesForAgreementAndPeriod(IList<string> agreementIds, DateRange dateRange);

  public Task<Dictionary<string, int>> RequestCitizenSaldos(IList<string> citizenIds);

  public Task<IDictionary<string, IDictionary<string, string>>> RequestCitizensForAlarms(IList<string> alarmIds);
  
  public Task<bool> UpdateAlarmUuidAgreement(string alarmUuid, string agreementUuid);
}
