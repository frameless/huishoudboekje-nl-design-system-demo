using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Tests.PaymentRecordServiceTests.Utils.Factories;
using BankServices.Tests.PaymentRecordServiceTests.Utils.Fakes;
using Core.CommunicationModels.AgreementModels;
using Core.CommunicationModels.AgreementModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using FluentAssertions;

namespace BankServices.Tests.PaymentRecordServiceTests;

public class PaymentRecordServiceTest
{
  private PaymentRecordFactory recordFactory = new PaymentRecordFactory();
  private PaymentInstructionFactory instructionFactory = new PaymentInstructionFactory();

  [Test]
  public void CreatingPaymentRecords_WithinDateRange_ShouldReturnNewRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)), null)
      .Result;

    //Assert
    records.Count.Should().Be(instructions.Count);
  }


  [Test]
  public void CreatingPaymentRecords_OutsideOfDateRange_ShouldReturnNoRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1721017950), dateTimeProvider.UnixToDateTime(1721117950)), null)
      .Result;

    //Assert
    records.Should().BeEmpty();
  }

  [Test]
  public void CreatingPaymentRecords_OnlyOneInRange_ShouldReturnOneRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(16, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1721017950), dateTimeProvider.UnixToDateTime(1721117950)), null)
      .Result;

    //Assert
    records.Count.Should().Be(1);
  }


  [Test]
  public void CreatingPaymentRecords_WithinDateRangeOneAlreadyExported_ShouldReturnOnlyNewRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));

    instructions.Add(
      new MinimalAgreement()
      {
        Amount = 100,
        OffsetAccount = new Account()
        {
          Name = "Agnus Beef",
          Iban = "NL52RABO7523644651"
        },
        UUID = "1d648a89-8d5d-4c8c-9f64-d716aad30822"
      },
      new PaymentInstruction()
      {
        ByMonth = [6, 7, 8],
        ByMonthDay = [13],
        StartDate = 1620617950,
        Type = 2
      });
    prod.SetDatabase(instructions);
    repo.SetCurrentDatabaseRecords(new List<IPaymentRecord>()
    {
      new PaymentRecord()
      {
        AgreementUuid = "1d648a89-8d5d-4c8c-9f64-d716aad30822",
        Amount = 100,
        CreatedAt = dateTimeProvider.UnixToday(),
        PaymentExportUuid = Guid.NewGuid().ToString(),
        OriginalProcessingDate = 1720877150,
        ProcessingDate = 1720877150
      }
    });
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)), null)
      .Result;

    //Assert
    records.Count.Should().Be(13);
    records.Should().NotContain(record => record.AgreementUuid == "1d648a89-8d5d-4c8c-9f64-d716aad30822");
  }

  [Test]
  public void
    CreatingPaymentRecordsWithProcessDate_WhenAlreadyExistWithDifferentProcessDate_ShouldReturnRecordsWithNewProcessDate()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var origianlRecords = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)), null)
      .Result;

    repo.SetCurrentDatabaseRecords(origianlRecords);
    var records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721017950)
      .Result;

    //Assert
    records.Count.Should().Be(13);
    records.Should().AllSatisfy(record => record.ProcessingDate.Equals(1721017950));
  }

  [Test]
  public void CreatingPaymentRecords_WithinDateRangeWithProcessDate_ShouldReturnRecordsWithSameProcessDate()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.CreatePaymentInstructionListMonthly(
      1620617950,
      null,
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(14, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(12, [6, 7, 8]),
      new KeyValuePair<int, int[]>(13, [6, 7, 8]),
      new KeyValuePair<int, int[]>(10, [6, 7, 8]),
      new KeyValuePair<int, int[]>(11, [6, 7, 8]));
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721017950)
      .Result;

    //Assert
    records.Count.Should().Be(13);
    records.Should().AllSatisfy(record => record.ProcessingDate.Equals(1721017950));
  }


  [Test]
  public void CreatingPaymentRecords_WithinDateRangeDifferentTypes_ShouldReturnNewRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1620617950,
        null,
        new KeyValuePair<int, int[]>(10, [6, 7, 8]));
    var instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1620617950,
      null,
      [3]);
    var instructionsOnce = instructionFactory.CreatePaymentInstructionListOnce(1720594283);
    var instructions = instructionFactory.Combine(instructionsWeekly, instructionsMonthly, instructionsOnce);

    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var records = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720494283), dateTimeProvider.UnixToDateTime(1721017950)), null)
      .Result;

    //Assert
    records.Count.Should().Be(instructions.Count);
  }

  [Test]
  public void
    CreatingPaymentRecordsDifferentTypesWithProcessDate_WhenAlreadyExistWithDifferentProcessDate_ShouldReturnRecordsWithNewProcessDate()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1620617950,
        null,
        new KeyValuePair<int, int[]>(10, [6, 7, 8]));
    var instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1620617950,
      null,
      [3]);
    var instructionsOnce = instructionFactory.CreatePaymentInstructionListOnce(1720594283);
    var instructions = instructionFactory.Combine(instructionsWeekly, instructionsMonthly, instructionsOnce);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var origianlRecords = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721057350)
      .Result;


    repo.SetCurrentDatabaseRecords(origianlRecords);
    var records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721017950)
      .Result;

    //Assert
    records.Count.Should().Be(3);
    records.Should().AllSatisfy(record => record.ProcessingDate.Equals(1721017950));
    origianlRecords.Should().AllSatisfy(record => record.ProcessingDate.Equals(1721057350));
  }

  [Test]
  public void CreatingPaymentRecordsDifferentTypes_WhenAlreadyExistAndExported_ShouldReturnNoRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();


    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1620617950,
        null,
        new KeyValuePair<int, int[]>(10, [6, 7, 8]));
    var instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1620617950,
      null,
      [3]);
    var instructionsOnce = instructionFactory.CreatePaymentInstructionListOnce(1720594283);
    var instructions = instructionFactory.Combine(instructionsWeekly, instructionsMonthly, instructionsOnce);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);


    // Act
    var originalRecords = service
      .CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721057350)
      .Result;

    foreach (var record in originalRecords)
    {
      record.PaymentExportUuid = Guid.NewGuid().ToString();
    }

    repo.SetCurrentDatabaseRecords(originalRecords);

    var records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1720617950), dateTimeProvider.UnixToDateTime(1721017950)),
        1721017950)
      .Result;

    //Assert
    records.Should().BeEmpty();
  }

  [Test]
  public void MatchingPaymentRecord_WithFittingTransaction_ShouldMarkPaymentRecordReconciled()
  {
    // Arange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();
    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();

    IList<IPaymentRecord> database = recordFactory.CreatePaymentRecords(20, 200, 1721017950, Guid.NewGuid().ToString());
    long transactionDate = database[1].ProcessingDate;
    int amount = database[1].Amount;
    string agreementUuid = database[1].AgreementUuid;
    string transactionUuid = Guid.NewGuid().ToString();

    repo.SetCurrentDatabaseRecords(database);
    var journalEntries = new List<IJournalEntryModel>()
    {
        new JournalEntryModel()
        {
          AgreementUuid = agreementUuid,
          Amount = amount,
          BankTransactionUuid = transactionUuid,
          UUID = Guid.NewGuid().ToString(),
          Date = transactionDate
        }
    };


    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);

    // Act
    var result = service.MatchTransactionsToPaymentRecords(journalEntries).Result;

    // Assert
    var resultingRecord = repo.GetAll(false, new PaymentRecordFilter() { TransactionUuids = [transactionUuid] }).Result.First();
    resultingRecord.Reconciled.Should().BeTrue();
    resultingRecord.TransactionUuid.Should().Be(transactionUuid);
  }

  [Test]
  public void UnMatchingPaymentRecord_AfterMatching_ShouldMarkPaymentRecordNotReconciled()
  {
    // Arange
    FakePaymentRecordRepository repo = new FakePaymentRecordRepository();
    DateTimeProvider dateTimeProvider = new DateTimeProvider();
    FakePaymentInstructionProducer prod = new FakePaymentInstructionProducer();


    string transactionUuid = Guid.NewGuid().ToString();
    IList<IPaymentRecord> database1 = recordFactory.CreatePaymentRecords(1, 200, 1721017950, Guid.NewGuid().ToString(), [transactionUuid]);
    var uuid = database1.First().UUID;
    IList<IPaymentRecord> database2 = recordFactory.CreatePaymentRecords(20, 200, 1721017950, Guid.NewGuid().ToString());

    var database = recordFactory.Combine(database1, database2);
    repo.SetCurrentDatabaseRecords(database);

    PaymentRecordService service = new PaymentRecordService(repo, prod, dateTimeProvider);

    // Act
    var result = service.UnMatchTransactionsFromPaymentRecords([transactionUuid]).Result;

    // Assert
    var resultingRecord = repo.GetById([uuid]).Result.First();
    resultingRecord.Reconciled.Should().BeFalse();
    resultingRecord.TransactionUuid.Should().BeNull();
  }

  [Test]
  public void CreatingPaymentRecordsDifferentTypesRepeated_WhenStartDatesAfterRange_ShouldReturnNoRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new();
    DateTimeProvider dateTimeProvider = new();


    FakePaymentInstructionProducer prod = new();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1730536042,
        null,
        new KeyValuePair<int, int[]>(2, [1,2,3,4,5,6,7,8,9,10,11,12]));
    IDictionary<IAgreement, IPaymentInstruction> instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1730536042,
      null,
      [1]);
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.Combine(instructionsWeekly, instructionsMonthly);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new(repo, prod, dateTimeProvider);

    // Act
    repo.SetCurrentDatabaseRecords([]);

    IList<IPaymentRecord> records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1725247237), dateTimeProvider.UnixToDateTime(1725247237)),
        null)
      .Result;

    //Assert
    records.Should().BeEmpty();
  }


  [Test]
  public void CreatingPaymentRecordsDifferentTypesRepeated_WhenEndDateBeforeRange_ShouldReturnNoRecords()
  {
    // Arrange
    FakePaymentRecordRepository repo = new();
    DateTimeProvider dateTimeProvider = new();


    FakePaymentInstructionProducer prod = new();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1620617950,
        1719901999,
        new KeyValuePair<int, int[]>(2, [1,2,3,4,5,6,7,8,9,10,11,12]));
    IDictionary<IAgreement, IPaymentInstruction> instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1620617950,
      1719901999,
      [2]);
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.Combine( instructionsMonthly, instructionsWeekly);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new(repo, prod, dateTimeProvider);

    // Act
    repo.SetCurrentDatabaseRecords([]);

    IList<IPaymentRecord> records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1725247237), dateTimeProvider.UnixToDateTime(1725247237)),
        null)
      .Result;

    //Assert
    records.Should().BeEmpty();
  }

  [Test]
  public void CreatingPaymentRecordsDifferentTypesRepeated_WhenEndDateOnRange_ShouldReturn()
  {
    // Arrange
    FakePaymentRecordRepository repo = new();
    DateTimeProvider dateTimeProvider = new();

    FakePaymentInstructionProducer prod = new();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1620617950,
        1725247237,
        new KeyValuePair<int, int[]>(2, [1,2,3,4,5,6,7,8,9,10,11,12]));
    IDictionary<IAgreement, IPaymentInstruction> instructionsWeekly = instructionFactory.CreatePaymentInstructionListWeekly(
      1620617950,
      1725247237,
      [1]);
    IDictionary<IAgreement, IPaymentInstruction> instructions = instructionFactory.Combine(instructionsMonthly, instructionsWeekly);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new(repo, prod, dateTimeProvider);

    // Act
    repo.SetCurrentDatabaseRecords([]);

    IList<IPaymentRecord> records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1725247220), dateTimeProvider.UnixToDateTime(1725247250)),
        null)
      .Result;

    //Assert
    records.Count.Should().Be(2);
  }

  [Test]
  public void CreatingPaymentRecordsDifferentTypesRepeated_WhenStartDateRange_ShouldReturn()
  {
    // Arrange
    FakePaymentRecordRepository repo = new();
    DateTimeProvider dateTimeProvider = new();

    FakePaymentInstructionProducer prod = new();
    IDictionary<IAgreement, IPaymentInstruction> instructionsMonthly =
      instructionFactory.CreatePaymentInstructionListMonthly(
        1725247237,
        null,
        new KeyValuePair<int, int[]>(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    IDictionary<IAgreement, IPaymentInstruction> instructionsWeekly =
      instructionFactory.CreatePaymentInstructionListWeekly(
        1725247237,
        null,
        [1]);
    IDictionary<IAgreement, IPaymentInstruction> instructions =
      instructionFactory.Combine(instructionsMonthly, instructionsWeekly);
    prod.SetDatabase(instructions);
    PaymentRecordService service = new(repo, prod, dateTimeProvider);

    // Act
    repo.SetCurrentDatabaseRecords([]);

    IList<IPaymentRecord> records = service.CreatePaymentRecords(
        new DateRange(dateTimeProvider.UnixToDateTime(1725247220), dateTimeProvider.UnixToDateTime(1725247250)),
        null)
      .Result;

    //Assert
    records.Count.Should().Be(2);
  }


}
