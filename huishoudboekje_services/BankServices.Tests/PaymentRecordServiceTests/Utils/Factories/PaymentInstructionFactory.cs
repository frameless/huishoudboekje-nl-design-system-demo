using Core.CommunicationModels.AgreementModels;
using Core.CommunicationModels.AgreementModels.Interfaces;

namespace BankServices.Tests.PaymentRecordServiceTests.Utils.Factories;

public class PaymentInstructionFactory
{
  public IDictionary<IAgreement, IPaymentInstruction> CreatePaymentInstructionListMonthly(
    long startDate, long? endDate, params KeyValuePair<int, int[]>[] dayAndMonths)
  {
    Random random = new();
    var result = new Dictionary<IAgreement, IPaymentInstruction>();
    foreach (var pair in dayAndMonths)
    {
      result.Add(new MinimalAgreement()
        {
          Amount = random.Next(-10000, 10000),
          OffsetAccount = new Account()
          {
            Name = "Agnus Beef",
            Iban = "NL52RABO7523644651"
          },
          UUID = Guid.NewGuid().ToString()
        },
        new PaymentInstruction()
        {
          ByMonth = pair.Value,
          ByMonthDay = [pair.Key],
          Type = 2,
          StartDate = startDate,
          EndDate = endDate
        });
    }
    return result;
  }


  public IDictionary<IAgreement, IPaymentInstruction> CreatePaymentInstructionListWeekly(
    long startDate, long? endDate, params int[][] daysOfWeek)
  {
    Random random = new();
    var result = new Dictionary<IAgreement, IPaymentInstruction>();
    foreach (var pair in daysOfWeek)
    {
      result.Add(new MinimalAgreement()
        {
          Amount = random.Next(-10000, 10000),
          OffsetAccount = new Account()
          {
            Name = "Agnus Beef",
            Iban = "NL52RABO7523644651"
          },
          UUID = Guid.NewGuid().ToString()
        },
        new PaymentInstruction()
        {
          ByDay = pair,
          Type = 3,
          StartDate = startDate,
          EndDate = endDate
        });
    }

    return result;
  }

  public IDictionary<IAgreement, IPaymentInstruction> CreatePaymentInstructionListOnce(params long[] dates)
  {
    Random random = new();
    var result = new Dictionary<IAgreement, IPaymentInstruction>();
    foreach (var pair in dates)
    {
      result.Add(new MinimalAgreement()
        {
          Amount = random.Next(-10000, 10000),
          OffsetAccount = new Account()
          {
            Name = "Agnus Beef",
            Iban = "NL52RABO7523644651"
          },
          UUID = Guid.NewGuid().ToString()
        },
        new PaymentInstruction()
        {
          Type = 1,
          StartDate = pair,
          EndDate = pair
        });
    }

    return result;
  }

  public IDictionary<IAgreement, IPaymentInstruction> Combine(params IDictionary<IAgreement, IPaymentInstruction>[] dictionaries)
  {
    var result = dictionaries.SelectMany(dict => dict)
      .ToDictionary();

    return result;
  }
}
