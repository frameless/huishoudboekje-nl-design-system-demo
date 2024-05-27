using Core.CommunicationModels.ReportModels;
using Core.CommunicationModels.ReportModels.Interfaces;
using UserApi.Producers.HttpModels;

namespace UserApi.Producers.Interfaces;

public interface IMonthlyReportProducer
{
  public Task<IMonthlyReport?> RequestMonthlyReport(long startDate, long endDate, string bsn);
}
