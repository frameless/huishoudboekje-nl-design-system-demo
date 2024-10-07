using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.Helpers;
using AlarmService.Logic.Producers;
using AlarmService.Logic.Services.AlarmServices;
using AlarmService.Logic.Services.AlarmServices.Interfaces;
using AlarmService.Logic.Services.EvaluationServices;
using AlarmService.Logic.Services.EvaluationServices.Interfaces;
using AlarmService.Logic.Services.SignalServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.Notifications;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.MessageQueue.CommonProducers;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using FakeItEasy;
using Microsoft.Extensions.Logging;

namespace AlarmService.Tests;

public class AlarmEvaluatorTests
{
  private IAlarmService _fakeAlarmService;
  private ISignalService _fakeSignalService;
  private IEvaluationResultService _evaluationResultService;
  private IAlarmRepository _fakeAlarmRepository;
  private ISignalRepository _fakeSignalRepository;
  private ICheckAlarmProducer _fakeProducer;
  private IRefetchProducer _fakeRefetchProducer;
  private ILogger<EvaluatorService> _fakeLogger;
  private readonly DateTimeProvider _realDateTimeProvider = new();

  private void FakeRepos()
  {
    _fakeAlarmService = A.Fake<IAlarmService>();
    _fakeSignalService = A.Fake<ISignalService>();
    _fakeAlarmRepository = A.Fake<IAlarmRepository>();
    _fakeSignalRepository = A.Fake<ISignalRepository>();
    _fakeLogger = A.Fake<ILogger<EvaluatorService>>();
    _fakeRefetchProducer = A.Fake<IRefetchProducer>();
    _evaluationResultService = new EvaluationResultService(_fakeAlarmRepository, _fakeSignalRepository, _fakeRefetchProducer);
    _fakeProducer = A.Fake<ICheckAlarmProducer>();

    // This call is made when there is a new check on date
    A.CallTo(() => _fakeAlarmRepository.Update(A<UpdateModel>._)).ReturnsLazily(
      alarm
        => Task.FromResult(alarm.Arguments.Get<IAlarmModel>("alarm"))!);

    A.CallTo(() => _fakeRefetchProducer.PublishRefetchRequest(A<Refetch>._)).DoesNothing();

    A.CallTo(() => _fakeSignalRepository.Update(A<ISignalModel>._)).ReturnsLazily(
      signal
        => Task.FromResult(signal.Arguments.Get<ISignalModel>("value"))!);

    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));
  }

  [SetUp]
  public void Setup()
  {
    FakeRepos();
  }

  [Test]
  [TestCase(100)]
  [TestCase(99)]
  [TestCase(101)]
  [TestCase(110)]
  [TestCase(90)]
  [TestCase(105)]
  [TestCase(95)]
  public void EvaluatingAlarms_WhenAlarmHasTransaction_ShouldNotGiveSignals(int transactionAmount)
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "test-1",
      AlarmType = 1,
      IsActive = true,
      DateMargin = 2,
      Amount = transactionAmount,
      AmountMargin = 10,
      RecurringMonths = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
      RecurringDayOfMonth = new List<int>() { 27 },
      RecurringDay = null,
      StartDate = 1706262983, // 26-01-2024
      EndDate = null,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };

    JournalEntryModel journalEntry = new JournalEntryModel()
    {
      Amount = 100,
      UUID = "test-1",
      Date = 1706521493, // 29-01-2024
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };

    A.CallTo(() => _fakeAlarmService.GetActiveByIds(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    Dictionary<string, string> agreementsToAlarm = new() { { journalEntry.AgreementUuid, alarm.UUID } };
    List<IJournalEntryModel> reconcilliatedEntries = [journalEntry];
    Dictionary<string, string> alarmToCitizen = new() { { alarm.UUID, "citizen-test-id-1" } };

    EvaluatorService sut = CreateSut();
    const long expectedCheckOnDate = 1709251200;
    // Act
    _ = sut.EvaluateReconciliatedJournalEntries(agreementsToAlarm, reconcilliatedEntries, alarmToCitizen);

    // Assert
    AssertNoSignalsAdded();
    AssertUpdateOneAlarm(expectedCheckOnDate);
  }

  [Test]
  [TestCase(111)]
  [TestCase(89)]
  [TestCase(500)]
  [TestCase(10)]
  [TestCase(150)]
  public void EvaluatingAlarms_WhenTransactionIsTooHighAmount_ShouldGiveSignalsWithDifference(int transactionAmount)
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "ALARM-1",
      AlarmType = 1,
      IsActive = true,
      DateMargin = 2,
      Amount = transactionAmount,
      AmountMargin = 10,
      RecurringMonths = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
      RecurringDayOfMonth = new List<int>() { 27 },
      RecurringDay = null,
      StartDate = 1706262983, // 26-01-2024
      EndDate = null,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };

    JournalEntryModel journalEntry = new()
    {
      Amount = 100,
      UUID = "test-1",
      Date = 1706521493, // 29-01-2024
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };



    A.CallTo(() => _fakeAlarmService.GetActiveByIds(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    Dictionary<string, string> agreementsToAlarm = new() { { journalEntry.AgreementUuid, alarm.UUID } };
    List<IJournalEntryModel> reconcilliatedEntries = [journalEntry];
    Dictionary<string, string> alarmToCitizen = new() { { alarm.UUID, "citizen-test-id-1" } };
    EvaluatorService sut = CreateSut();

    int expectedOffByAmount = 100 - transactionAmount;
    int expectedSignalType = 2;
    long expectedCheckOnDate = 1709251200;
    // Act
    _ = sut.EvaluateReconciliatedJournalEntries(agreementsToAlarm, reconcilliatedEntries, alarmToCitizen);

    // Assert
    AssertOneSignal(expectedOffByAmount, alarm, expectedSignalType, journalEntry);
    AssertSignalRefetchCalled();
    AssertUpdateOneAlarm(expectedCheckOnDate);
  }

  [Test]
  [TestCase(
    1706521493,
    1,
    new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
    null,
    new int[] { 27 },
    null)] // 26-01-2024
  [TestCase(1706521493, 2, null, new int[] { 6 }, null, null)] // 26-01-2024
  [TestCase(1706521493, 3, null, null, null, 1706521493)] // 26-01-2024
  [TestCase(1706521493, 4, new int[] { 1 }, null, new int[] { 27 }, 1706521493)] // 26-01-2024
  public void EvaluatingAlarmsOfDifferentTypes_WhenTransactionIsTooHighAmount_ShouldGivesignalsWithDifference(
    long transactionDay,
    int alarmType,
    int[]? recurringMonths,
    int[]? recurringDays,
    int[]? recurringDayOfMonth,
    long? endDate)
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "test-1",
      AlarmType = alarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = recurringMonths,
      RecurringDayOfMonth = recurringDayOfMonth,
      RecurringDay = recurringDays,
      StartDate = 1706262983, // 26-01-2024
      EndDate = endDate,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };
    JournalEntryModel journalEntry = new()
    {
      Amount = 80,
      UUID = "test-1",
      Date = transactionDay,
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };
    A.CallTo(() => _fakeAlarmService.GetActiveByIds(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    Dictionary<string, string> agreementsToAlarm = new() { { journalEntry.AgreementUuid, alarm.UUID } };
    List<IJournalEntryModel> reconcilliatedEntries = [journalEntry];
    Dictionary<string, string> alarmToCitizen = new() { { alarm.UUID, "citizen-test-id-1" } };
    EvaluatorService sut = CreateSut();

    int expectedOffByAmount = -20;
    int expectedSignalType = 2;
    // Act
    _ = sut.EvaluateReconciliatedJournalEntries(agreementsToAlarm, reconcilliatedEntries, alarmToCitizen);

    // Assert
    AssertOneSignal(expectedOffByAmount, alarm, expectedSignalType, journalEntry);
    AssertSignalRefetchCalled();
  }

  [Test]
  [TestCase(
    1706521493,
    1,
    new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
    null,
    new int[] { 27 },
    null)] // 26-01-2024
  [TestCase(1706521493, 2, null, new int[] { 6 }, null, null)] // 26-01-2024
  [TestCase(1706521493, 3, null, null, null, 1706521493)] // 26-01-2024
  [TestCase(1706521493, 4, new int[] { 1 }, null, new int[] { 27 }, 1706521493)] // 26-01-2024
  public void EvaluatingAlarmsOfDifferentTypes_WhenTransactionHasCorrectAmount_ShouldNotGiveSignals(
    long transactionDay,
    int alarmType,
    int[]? recurringMonths,
    int[]? recurringDays,
    int[]? recurringDayOfMonth,
    long? endDate)
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "test-1",
      AlarmType = alarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = recurringMonths,
      RecurringDayOfMonth = recurringDayOfMonth,
      RecurringDay = recurringDays,
      StartDate = 1706262983, // 26-01-2024
      EndDate = endDate,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };
    JournalEntryModel journalEntry = new()
    {
      Amount = 90,
      UUID = "test-1",
      Date = transactionDay,
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };
    A.CallTo(() => _fakeAlarmService.GetActiveByIds(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    Dictionary<string, string> agreementsToAlarm = new() { { journalEntry.AgreementUuid, alarm.UUID } };
    List<IJournalEntryModel> reconcilliatedEntries = [journalEntry];
    Dictionary<string, string> alarmToCitizen = new() { { alarm.UUID, "citizen-test-id-1" } };
    IEvaluatorService sut = CreateSut();
    // Act
    _ = sut.EvaluateReconciliatedJournalEntries(agreementsToAlarm, reconcilliatedEntries, alarmToCitizen);

    // Assert
    AssertNoSignalsAdded();
  }

  [Test]
  public void EvaluatingAlarmsOnTimeframe_WhenNoJournalEntriesInMostRecentPeriod_ShouldGiveSignals()
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "test-1",
      AlarmType = 1,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
      RecurringDayOfMonth = new List<int>() { 27 },
      RecurringDay = null,
      CheckOnDate = 1706603898, // 30-01-2024
      StartDate = 1706262983, // 26-01-2024
      EndDate = null
    };

    A.CallTo(() => _fakeAlarmService.GetAllActiveByCheckOnDateBefore(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });


    IDateTimeProvider provider = CreateFakeDateTimeProvider(1706603898, today: new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    EvaluatorService sut = CreateSut(dateTimeProvider: provider);

    // Act
    _ = sut.EvaluateMissingTransactionAlarms();

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
        () => _fakeAlarmRepository.UpdateMany(

          // First of march
          A<IList<IAlarmModel>>.That.Matches(list => list.Count == 1 && list[0].CheckOnDate == 1709251200)))
      .MustHaveHappenedOnceExactly();

    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustHaveHappenedOnceExactly();
    AssertSignalRefetchCalled();
  }

  [Test]
  [TestCase(
    1,
    new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
    null,
    new int[] { 27 },
    null)] // 26-01-2024
  [TestCase(2, null, new int[] { 6 }, null, null)] // 26-01-2024
  [TestCase(3, null, null, null, 1706521493)] // 26-01-2024
  [TestCase(4, new int[] { 1 }, null, new int[] { 27 }, 1706521493)] // 26-01-2024
  public void EvaluatingMultipleTypeAlarmsOnTimeframe_WhenNoJournalEntriesInMostRecentPeriod_ShouldGiveSignals(
    int alarmType,
    int[]? recurringMonths,
    int[]? recurringDays,
    int[]? recurringDayOfMonth,
    long? endDate)
  {
    // Arrange
    AlarmModel alarm = new AlarmModel()
    {
      UUID = "test-1",
      AlarmType = alarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = recurringMonths,
      RecurringDayOfMonth = recurringDayOfMonth,
      RecurringDay = recurringDays,
      CheckOnDate = 1706603898, // 30-01-2024
      StartDate = 1706262983, // 26-01-2024
      EndDate = null
    };
    A.CallTo(() => _fakeAlarmService.GetAllActiveByCheckOnDateBefore(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });


    IDateTimeProvider provider = CreateFakeDateTimeProvider(1706603898, today: new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    EvaluatorService sut = CreateSut(dateTimeProvider: provider);

    // Act
    _ = sut.EvaluateMissingTransactionAlarms();

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustHaveHappenedOnceExactly();

    AssertSignalRefetchCalled();
  }

  [Test]
  [TestCase(
    1,
    new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 },
    null,
    new int[] { 27 },
    null)] // 26-01-2024
  [TestCase(2, null, new int[] { 6 }, null, null)] // 26-01-2024
  [TestCase(3, null, null, null, 1706521493)] // 26-01-2024
  [TestCase(4, new int[] { 1 }, null, new int[] { 27 }, 1706521493)]
  public void EvaluatingMultipleTypeAlarmsOnTimeframe_WhenJournalEntriesInMostRecentPeriod_ShouldNotGiveSignals(
    int alarmType,
    int[]? recurringMonths,
    int[]? recurringDays,
    int[]? recurringDayOfMonth,
    long? endDate)
  {
    // Arrange
    AlarmModel alarm = new()
    {
      UUID = "test-1",
      AlarmType = alarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = recurringMonths,
      RecurringDayOfMonth = recurringDayOfMonth,
      RecurringDay = recurringDays,
      CheckOnDate = 1709195589, // 29-02-2024
      StartDate = 1706262983, // 26-01-2024
      EndDate = null
    };
    A.CallTo(() => _fakeAlarmRepository.GetActiveByCheckOnDateBeforeNoTracking(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });


    IDateTimeProvider provider = CreateFakeDateTimeProvider(1706603898, today: new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    EvaluatorService sut = CreateSut(dateTimeProvider: provider);

    // Act
    _ = sut.EvaluateMissingTransactionAlarms();

    // Assert
    AssertNoAlarmsUpdated();
    AssertNoSignalsAdded();
  }


  [Test]
  public void EvaluatingSaldoAlarm_WhenNegativeSaldo_ShouldCreateSignal()
  {
    // Arrange
    SetUpFakeProducerRequestCitizenSaldos(-10);

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter!.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));


    EvaluatorService sut = CreateSut();

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, 0);

    // Assert
    AssertNoAlarmsUpdated();
    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustHaveHappenedOnceExactly();

    AssertSignalRefetchCalled();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenPositiveSaldo_ShouldNotCreateSignal()
  {
    // Arrange
    SetUpFakeProducerRequestCitizenSaldos(10);

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));


    EvaluatorService sut = CreateSut();

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, 0);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustNotHaveHappened();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenNegativeSaldoButAboveThreshhold_ShouldNotCreateSignal()
  {
    // Arrange
    SetUpFakeProducerRequestCitizenSaldos(-10);

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));


    EvaluatorService sut = CreateSut();

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, -20);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustNotHaveHappened();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenPostiveSaldoButBelowThreshhold_ShouldCreateSignal()
  {
    // Arrange
    SetUpFakeProducerRequestCitizenSaldos(10);

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));


    EvaluatorService sut = CreateSut();

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, 15);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustHaveHappenedOnceExactly();

    AssertSignalRefetchCalled();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenSignalAlreadyExists_ShouldSetUpdatedAt()
  {
    // Arrange
    IDateTimeProvider provider = CreateFakeDateTimeProvider(20);
    SetUpFakeProducerRequestCitizenSaldos(-10);

    A.CallTo(
      () => _fakeSignalRepository.GetAll(
        false,
        A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null))).ReturnsLazily(
      obj =>
      {
        var ids = obj.Arguments.Get<SignalFilterModel>("filter").CitizenIds;
        IList<ISignalModel> result = new List<ISignalModel>();
        foreach (string id in ids)
        {
          ISignalModel signal = new SignalModel()
          {
            IsActive = true,
            CreatedAt = 100000,
            CitizenUuid = id,
            Type = 4
          };
          result.Add(signal);
        }

        return Task.FromResult(result);
      });


    EvaluatorService sut = CreateSut(dateTimeProvider: provider);

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, 0);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count > 0 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustNotHaveHappened();

    A.CallTo(
      () => _fakeSignalRepository.Update(
        A<ISignalModel>.That.Matches(
          signal => signal.CitizenUuid == "test-1" &&
                    signal.UpdatedAt == 20 && signal.IsActive == true)))
      .MustHaveHappenedOnceExactly();
  }

   [Test]
  public void EvaluatingSaldoAlarm_WhenSignalAlreadyExistsButIsNotActive_ShouldSetUpdatedAtAndActivateSignal()
  {
    // Arrange
    IDateTimeProvider provider = CreateFakeDateTimeProvider(20);
    SetUpFakeProducerRequestCitizenSaldos(-10);
    A.CallTo(
      () => _fakeSignalRepository.GetAll(
        false,
        A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null))).ReturnsLazily(
      obj =>
      {
        var ids = obj.Arguments.Get<SignalFilterModel>("filter").CitizenIds;
        IList<ISignalModel> result = new List<ISignalModel>();
        foreach (string id in ids)
        {
          ISignalModel signal = new SignalModel()
          {
            IsActive = false,
            CreatedAt = 10000,
            CitizenUuid = id,
            Type = 4
          };
          result.Add(signal);
        }

        return Task.FromResult(result);
      });


    EvaluatorService sut = CreateSut(dateTimeProvider: provider);

    // Act
    _ = sut.EvaluateCitizenSaldos(new List<string>() { "test-1" }, 0);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count > 0 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustNotHaveHappened();

    A.CallTo(
      () => _fakeSignalRepository.Update(
        A<ISignalModel>.That.Matches(
          signal => signal.CitizenUuid == "test-1" &&
                    signal.UpdatedAt == (long)20 && signal.IsActive == true)))
      .MustHaveHappenedOnceExactly();
  }

  // Helper functions

  private EvaluatorService CreateSut(
    IAlarmService? alarmService = null,
    ISignalService? signalService = null,
    IEvaluationResultService? evaluationResultService = null,
    ICheckAlarmProducer? producer = null,
    IDateTimeProvider? dateTimeProvider = null)
  {
    return new EvaluatorService(
      alarmService ?? _fakeAlarmService,
      signalService ?? _fakeSignalService,
      evaluationResultService ?? _evaluationResultService,
      producer ?? _fakeProducer,
      dateTimeProvider ?? _realDateTimeProvider,
      new CheckOnDateHelper(_realDateTimeProvider),
      new EvaluationHelper(_realDateTimeProvider),
      _fakeLogger);
  }

  private IDateTimeProvider CreateFakeDateTimeProvider(long unixNow, DateTime? today = null)
  {
    IDateTimeProvider provider = A.Fake<IDateTimeProvider>();

    A.CallTo(() => provider.UnixNow()).Returns(unixNow);

    A.CallTo(
      () =>
        provider.Today()).Returns(today ?? DateTime.Today);

    //executes real functions
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => _realDateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => _realDateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));
    return provider;
  }

  private void AssertUpdateOneAlarm(long expectedCheckOnDate)
  {
    A.CallTo(
        () => _fakeAlarmRepository.UpdateMany(

          // First of march
          A<IList<IAlarmModel>>.That.Matches(list => list.Count == 1 && list[0].CheckOnDate == expectedCheckOnDate)))
      .MustHaveHappenedOnceExactly();
  }

  private void AssertOneSignal(int expectedOffByAmount, AlarmModel alarm, int expectedSignalType,
    JournalEntryModel journalEntry)
  {
    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(
          A<IList<ISignalModel>>.That.Matches(
            signals => signals.Count == 1 && signals[0].OffByAmount == expectedOffByAmount &&
                       signals[0].AlarmUuid == alarm.UUID && signals[0].Type == expectedSignalType))).MustHaveHappenedOnceExactly();

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Not.Matches(
              signals => signals.Count == 1 &&
                         signals[0].OffByAmount == expectedOffByAmount &&
                         signals[0].AlarmUuid == alarm.UUID &&
                         signals[0].Type == expectedSignalType &&
                         signals[0].JournalEntryUuids!.Count == 1 &&
                         signals[0].JournalEntryUuids![0] == journalEntry.UUID)))
      .MustNotHaveHappened();
  }

  private void AssertNoSignalsAdded()
  {
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustNotHaveHappened();
  }
  private void AssertNoAlarmsUpdated()
  {
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._)).MustNotHaveHappened();
  }

  private void AssertSignalRefetchCalled()
  {
      A.CallTo(() => _fakeRefetchProducer.PublishRefetchRequest(A<Refetch>._)).MustHaveHappened();
  }
  private void SetUpFakeProducerRequestCitizenSaldos(int saldo)
  {
    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        IList<string>? ids = list.Arguments.Get<IList<string>>("citizenIds");
        Dictionary<string, int> result = ids!.ToDictionary(id => id, id => saldo);
        return Task.FromResult(result);
      });
  }
}
