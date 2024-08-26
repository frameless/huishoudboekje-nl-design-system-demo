using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.Interfaces;
using BankServices.Logic.Services.PaymentRecordService.Queries;
using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DateTimeProvider;
using PaymentRecord = Core.CommunicationModels.PaymentModels.PaymentRecord;

namespace BankServices.Logic.Services.PaymentRecordService.QueryHandlers;

internal class CreatePaymentRecordsHandler(
  IPaymentRecordRepository paymentRecordRepository,
  IPaymentRecordProducer paymentRecordProducer,
  IDateTimeProvider dateTimeProvider) : IQueryHandler<CreatePaymentRecords, IList<IPaymentRecord>>
{
  public async Task<IList<IPaymentRecord>> HandleAsync(CreatePaymentRecords query)
  {
    IDictionary<IAgreement, IPaymentInstruction> agreementsWithPaymentInstructions =
      await paymentRecordProducer.GetAgreementsWithPaymentInstruction(query.DateRange);
    Dictionary<string, List<IPaymentRecord>> existingPerAgreement = await GetExistingRecordsPerAgreement(query, agreementsWithPaymentInstructions);
    Dictionary<string, List<IPaymentRecord>> paymentRecords = new()
    {
      ["existing"] = [],
      ["update"] = [],
      ["create"] = []
    };

    foreach (KeyValuePair<IAgreement, IPaymentInstruction> keyvalue in agreementsWithPaymentInstructions)
    {
      IAgreement agreement = keyvalue.Key;
      IPaymentInstruction paymentInstruction = keyvalue.Value;
      IList<DateTime>? processingDates = GetProcessingDateIfInRange(paymentInstruction, query);
      if (processingDates == null) continue;
      List<IPaymentRecord> existingRecords = existingPerAgreement.GetValueOrDefault(agreement.UUID, []);
      foreach (DateTime processingDate in processingDates)
      {
        paymentRecords = CreateOrFindPaymentRecord(agreement, existingRecords,
          dateTimeProvider.DateTimeToUnix(processingDate), paymentRecords, query.ProcessAt);
      }
    }

    List<IPaymentRecord> returnableRecords = paymentRecords["existing"];
    if (paymentRecords["create"].Count > 0)
    {
      returnableRecords.AddRange(await paymentRecordRepository.Add(paymentRecords["create"]));
    }

    if (paymentRecords["update"].Count > 0)
    {
      await paymentRecordRepository.Update(paymentRecords["update"]);
      returnableRecords.AddRange(paymentRecords["update"]);
    }

    return returnableRecords;
  }

  private async Task<Dictionary<string, List<IPaymentRecord>>> GetExistingRecordsPerAgreement(CreatePaymentRecords query,
    IDictionary<IAgreement, IPaymentInstruction> agreementsWithPaymentInstructions)
  {
    IList<string> agreementIds = agreementsWithPaymentInstructions.Keys.Select(agreement => agreement.UUID).ToList();
    IList<IPaymentRecord> result = await paymentRecordRepository.GetExisting(agreementIds,
      dateTimeProvider.DateTimeToUnix(query.DateRange.From), dateTimeProvider.DateTimeToUnix(query.DateRange.To));

    Dictionary<string, List<IPaymentRecord>> existingPerAgreement = result.GroupBy(record => record.AgreementUuid).ToDictionary(g => g.Key, g => g.ToList());
    return existingPerAgreement;
  }

  private Dictionary<string, List<IPaymentRecord>> CreateOrFindPaymentRecord(IAgreement agreement, IList<IPaymentRecord> existing,
    long processingDate, Dictionary<string, List<IPaymentRecord>> paymentRecords, long? processAt)
  {
    IList<IPaymentRecord> previous = existing.Where(record =>
      record.AgreementUuid == agreement.UUID && record.OriginalProcessingDate == processingDate).ToList();

    if (previous.Count > 0)
    {
      IPaymentRecord? exportPrev = ShouldExportPrevious(previous);
      if (exportPrev != null)
      {
        paymentRecords = AddToExistingOrUpdate(paymentRecords, exportPrev, processAt, processingDate);
      }
    }
    else
    {
      PaymentRecord record = new()
      {
        Amount = agreement.Amount,
        AgreementUuid = agreement.UUID,
        CreatedAt = dateTimeProvider.UnixNow(),
        ProcessingDate = processAt ?? processingDate,
        OriginalProcessingDate = processingDate,
        AccountIban = agreement.OffsetAccount.Iban,
        AccountName = agreement.OffsetAccount.Name,
        Description = agreement.Description
      };
      paymentRecords["create"].Add(record);
    }

    return paymentRecords;
  }


  private Dictionary<string, List<IPaymentRecord>> AddToExistingOrUpdate(
    Dictionary<string, List<IPaymentRecord>> current,
    IPaymentRecord record, long? processAt, long processingDate)
  {
      if (record.ProcessingDate != (processAt ?? processingDate))
      {
        record.ProcessingDate = processAt ?? processingDate;
        current["update"].Add(record);
      }
      else
      {
        current["existing"].Add(record);
      }
      return current;
  }

  private IPaymentRecord? ShouldExportPrevious(IList<IPaymentRecord> previous)
  {
    foreach (var prev in previous)
    {
      if (prev.PaymentExportUuid == null)
      {
        return prev;
      }
    }

    return null;
  }

  private IList<DateTime>? GetProcessingDateIfInRange(IPaymentInstruction paymentInstruction, CreatePaymentRecords query)
  {
    switch(paymentInstruction.Type)
    {
      case 1:
      {
        IList<DateTime> dates = query.DateRange.GetDatesInRange()
          .Where(date => date.Date == dateTimeProvider.UnixToDateTime(paymentInstruction.StartDate).Date).ToList();
        return dates.Count > 0 ? dates : null;
      }

      case 2:
      {
        IList<DateTime> dates = query.DateRange.GetDatesInRange().Where(
            date => paymentInstruction is { ByMonth: not null, ByMonthDay: not null } &&
                    paymentInstruction.ByMonthDay.Any(day => day == date.Day) &&
                    paymentInstruction.ByMonth.Any(month => month == date.Month))
          .Where(date => date.Date >= dateTimeProvider.UnixToDateTime(paymentInstruction.StartDate).Date && (paymentInstruction.EndDate == null ||  date.Date <= dateTimeProvider.UnixToDateTime((long)paymentInstruction.EndDate).Date)).ToList();
        return dates.Count > 0 ? dates : null;
      }

      case 3:
      {
        IList<DateTime> dates = query.DateRange.GetDatesInRange()
          .Where(date => paymentInstruction.ByDay != null && paymentInstruction.ByDay.Any(day => day == (int)date.DayOfWeek))
          .Where(date => date.Date >= dateTimeProvider.UnixToDateTime(paymentInstruction.StartDate).Date && (paymentInstruction.EndDate == null ||  date.Date <= dateTimeProvider.UnixToDateTime((long)paymentInstruction.EndDate).Date)).ToList();
        return dates.Count > 0 ? dates : null;
      }

      default:
        return null;
    }
  }
}
