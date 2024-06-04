using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.Controllers.Evaluation;
using AlarmService.Logic.Misc;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using FakeItEasy;
using FluentAssertions;

namespace AlarmService.Tests;

public class AlarmEvaluatorTests
{
  private IAlarmRepository _fakeAlarmRepository;
  private ISignalRepository _fakeSignalRepository;
  private ICheckAlarmProducer _fakeProducer;

  private void FakeRepos()
  {
    _fakeAlarmRepository = A.Fake<IAlarmRepository>();
    _fakeSignalRepository = A.Fake<ISignalRepository>();
    _fakeProducer = A.Fake<ICheckAlarmProducer>();

    // This call is made when there is a new checkondate
    A.CallTo(() => _fakeAlarmRepository.Update(A<UpdateModel>._)).ReturnsLazily(
      alarm
        => Task.FromResult(alarm.Arguments.Get<IAlarmModel>("alarm")));

    A.CallTo(() => _fakeSignalRepository.Update(A<ISignalModel>._)).ReturnsLazily(
      signal
        => Task.FromResult(signal.Arguments.Get<ISignalModel>("value")));

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
    // Arange
    AlarmModel alarm = new AlarmModel()
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

    A.CallTo(() => _fakeAlarmRepository.GetMultipleByIdsNoTracking(new List<string>() { "test-1" }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    var dateTimeProvider = new DateTimeProvider();
    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      dateTimeProvider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateReconciliatedJournalEntries(
      new Dictionary<string, string>()
        { { "test-1", "test-1" } },
      new List<IJournalEntryModel>() { journalEntry },
      new Dictionary<string, string>()
        { { "test-1", "test-1" } });

    // Assert
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustNotHaveHappened();
    A.CallTo(
        () => _fakeAlarmRepository.UpdateMany(

          // 1st of march
          A<IList<IAlarmModel>>.That.Matches(list => list.Count == 1 && list[0].CheckOnDate == 1709251200)))
      .MustHaveHappenedOnceExactly();
  }

  [Test]
  [TestCase(111)]
  [TestCase(89)]
  [TestCase(500)]
  [TestCase(10)]
  [TestCase(150)]
  public void EvaluatingAlarms_WhenTransactionIsTooHighAmount_ShouldGivesignalsWithDifference(int transactionAmount)
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
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

    A.CallTo(() => _fakeAlarmRepository.GetMultipleByIdsNoTracking(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    var dateTimeProvider = new DateTimeProvider();
    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      dateTimeProvider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateReconciliatedJournalEntries(
      new Dictionary<string, string>()
        { { journalEntry.AgreementUuid, alarm.UUID } },
      new List<IJournalEntryModel>() { journalEntry },
      new Dictionary<string, string>()
        { { alarm.UUID, "test-1" } });

    // Assert
    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(
          A<IList<ISignalModel>>.That.Matches(
            signals => signals.Count == 1 && signals[0].OffByAmount == 100 - transactionAmount &&
                       signals[0].AlarmUuid == alarm.UUID && signals[0].Type == 2))).MustHaveHappenedOnceExactly();

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Not.Matches(
              signals => signals.Count == 1 &&
                         signals[0].OffByAmount == 100 - transactionAmount &&
                         signals[0].AlarmUuid == alarm.UUID &&
                         signals[0].Type == 2 &&
                         signals[0].JournalEntryUuids.Count == 1 &&
                         signals[0].JournalEntryUuids[0] == journalEntry.UUID)))
      .MustNotHaveHappened();

    A.CallTo(
        () => _fakeAlarmRepository.UpdateMany(

          // First of march
          A<IList<IAlarmModel>>.That.Matches(list => list.Count == 1 && list[0].CheckOnDate == 1709251200)))
      .MustHaveHappenedOnceExactly();
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
    int AlarmType,
    int[]? RecurringMonths,
    int[]? RecurringDays,
    int[]? RecurringDayOfMonth,
    long? endDate)
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
    {
      UUID = "test-1",
      AlarmType = AlarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = RecurringMonths,
      RecurringDayOfMonth = RecurringDayOfMonth,
      RecurringDay = RecurringDays,
      StartDate = 1706262983, // 26-01-2024
      EndDate = endDate,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };
    JournalEntryModel journalEntry = new JournalEntryModel()
    {
      Amount = 80,
      UUID = "test-1",
      Date = transactionDay,
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };
    A.CallTo(() => _fakeAlarmRepository.GetMultipleByIdsNoTracking(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    var dateTimeProvider = new DateTimeProvider();
    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      dateTimeProvider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateReconciliatedJournalEntries(
      new Dictionary<string, string>()
        { { journalEntry.AgreementUuid, alarm.UUID } },
      new List<IJournalEntryModel>() { journalEntry },
      new Dictionary<string, string>()
        { { alarm.UUID, "test-1" } });

    // Assert
    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(
          A<IList<ISignalModel>>.That.Matches(
            signals => signals.Count == 1 && signals[0].OffByAmount == -20 &&
                       signals[0].AlarmUuid == alarm.UUID && signals[0].Type == 2))).MustHaveHappenedOnceExactly();

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Not.Matches(
              signals => signals.Count == 1 &&
                         signals[0].OffByAmount == -20 &&
                         signals[0].AlarmUuid == alarm.UUID &&
                         signals[0].Type == 2 &&
                         signals[0].JournalEntryUuids.Count == 1 &&
                         signals[0].JournalEntryUuids[0] == journalEntry.UUID)))
      .MustNotHaveHappened();
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
  public void EvaluatingAlarmsOfDifferentTypes_WhenTransactionHasCorrectAmount_ShouldNotGivesignals(
    long transactionDay,
    int AlarmType,
    int[]? RecurringMonths,
    int[]? RecurringDays,
    int[]? RecurringDayOfMonth,
    long? endDate)
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
    {
      UUID = "test-1",
      AlarmType = AlarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = RecurringMonths,
      RecurringDayOfMonth = RecurringDayOfMonth,
      RecurringDay = RecurringDays,
      StartDate = 1706262983, // 26-01-2024
      EndDate = endDate,
      CheckOnDate = 1706572800 // 30-01-2024 UTC
    };
    JournalEntryModel journalEntry = new JournalEntryModel()
    {
      Amount = 90,
      UUID = "test-1",
      Date = transactionDay,
      IsAutomaticallyReconciled = true,
      AgreementUuid = "test-1",
      BankTransactionUuid = "test-1",
      StatementUuid = "test-1"
    };
    A.CallTo(() => _fakeAlarmRepository.GetMultipleByIdsNoTracking(new List<string>() { alarm.UUID }))
      .Returns(new List<IAlarmModel>() { alarm });

    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeProducer.RequestJournalEntriesForAgreementAndPeriod(A<IList<string>>._, A<DateRange>._)).Returns(
      new Dictionary<string, IList<IJournalEntryModel>>()
        { { journalEntry.AgreementUuid, new List<IJournalEntryModel>() { journalEntry } } });

    var dateTimeProvider = new DateTimeProvider();
    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      dateTimeProvider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateReconciliatedJournalEntries(
      new Dictionary<string, string>()
        { { journalEntry.AgreementUuid, alarm.UUID } },
      new List<IJournalEntryModel>() { journalEntry },
      new Dictionary<string, string>()
        { { alarm.UUID, "test-1" } });

    // Assert
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustNotHaveHappened();
  }

  [Test]
  public void EvaluatingAlarmsOnTimeframe_WhenNoJournalEntriesInMostRecentPeriod_ShouldGiveSignals()
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
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

    A.CallTo(() => _fakeAlarmRepository.GetAllByCheckOnDateBeforeNoTracking(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(
      () =>
        provider.Today()).Returns(new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    A.CallTo(
      () =>
        provider.UnixNow()).Returns(1706603898);

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateMissingTransactionAlarms();

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
    int AlarmType,
    int[]? RecurringMonths,
    int[]? RecurringDays,
    int[]? RecurringDayOfMonth,
    long? endDate)
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
    {
      UUID = "test-1",
      AlarmType = AlarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = RecurringMonths,
      RecurringDayOfMonth = RecurringDayOfMonth,
      RecurringDay = RecurringDays,
      CheckOnDate = 1706603898, // 30-01-2024
      StartDate = 1706262983, // 26-01-2024
      EndDate = null
    };
    A.CallTo(() => _fakeAlarmRepository.GetAllByCheckOnDateBeforeNoTracking(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(
      () =>
        provider.Today()).Returns(new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    A.CallTo(
      () =>
        provider.UnixNow()).Returns(1706603898);

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateMissingTransactionAlarms();

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));
    A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustHaveHappenedOnceExactly();
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
    int AlarmType,
    int[]? RecurringMonths,
    int[]? RecurringDays,
    int[]? RecurringDayOfMonth,
    long? endDate)
  {
    // Arange
    AlarmModel alarm = new AlarmModel()
    {
      UUID = "test-1",
      AlarmType = AlarmType,
      IsActive = true,
      DateMargin = 2,
      Amount = 100,
      AmountMargin = 10,
      RecurringMonths = RecurringMonths,
      RecurringDayOfMonth = RecurringDayOfMonth,
      RecurringDay = RecurringDays,
      CheckOnDate = 1709195589, // 29-02-2024
      StartDate = 1706262983, // 26-01-2024
      EndDate = null
    };
    A.CallTo(() => _fakeAlarmRepository.GetAllByCheckOnDateBeforeNoTracking(A<DateTime>._)).Returns(
      new List<IAlarmModel>() { alarm });

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(
      () =>
        provider.Today()).Returns(new DateTime(2024, 2, 28, 0, 0, 0, DateTimeKind.Utc));
    A.CallTo(
      () =>
        provider.UnixNow()).Returns(1706603898);

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateMissingTransactionAlarms();

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    A.CallTo(
      () =>
        _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).MustNotHaveHappened();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenNegativeSaldo_ShouldCreateSignal()
  {
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, -10);
        }

        return Task.FromResult(result);
      });

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, 0);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    // A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustHaveHappenedOnceExactly();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenPositiveSaldo_ShouldNotCreateSignal()
  {
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, 10);
        }

        return Task.FromResult(result);
      });

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, 0);

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
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, -10);
        }

        return Task.FromResult(result);
      });

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, -20);

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
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, 10);
        }

        return Task.FromResult(result);
      });

    IList<ISignalModel> emptylist = new List<ISignalModel>();

    A.CallTo(
        () => _fakeSignalRepository.GetAll(
          false,
          A<SignalFilterModel?>.That.Matches(filter => filter.CitizenIds != null)))
      .Returns(Task.FromResult(emptylist));

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, 15);

    // Assert
    A.CallTo(() => _fakeAlarmRepository.UpdateMany(A<IList<IAlarmModel>>._))
      .Returns(Task.FromResult(true));

    // A.CallTo(() => _fakeSignalRepository.InsertMany(A<IList<ISignalModel>>._)).Returns(Task.FromResult(true));

    A.CallTo(
        () =>
          _fakeSignalRepository.InsertMany(
            A<IList<ISignalModel>>.That.Matches(
              signals => signals.Count == 1 &&
                         signals[0].Type == 4 &&
                         signals[0].CitizenUuid == "test-1")))
      .MustHaveHappenedOnceExactly();
  }

  [Test]
  public void EvaluatingSaldoAlarm_WhenSignalAlreadyExists_ShouldSetUpdatedAt()
  {
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => provider.UnixNow()).Returns(20);

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, -10);
        }

        return Task.FromResult(result);
      });

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

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, 0);

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
    // Arange

    var dateTimeProvider = new DateTimeProvider();

    var provider = A.Fake<IDateTimeProvider>();
    A.CallTo(() => provider.UnixToDateTime(A<long>._)).ReturnsLazily(
      time
        => dateTimeProvider.UnixToDateTime(time.Arguments.Get<long>("unixtime")));

    A.CallTo(() => provider.UnixNow()).Returns(20);

    A.CallTo(() => provider.EndOfDay(A<DateTime>._)).ReturnsLazily(
      time
        => dateTimeProvider.EndOfDay(time.Arguments.Get<DateTime>("datetime")));

    A.CallTo(() => _fakeProducer.RequestCitizenSaldos(A<IList<string>>._)).ReturnsLazily(
      list =>
      {
        var ids = list.Arguments.Get<IList<string>>("citizenIds");
        var result = new Dictionary<string, int>();
        foreach (string id in ids)
        {
          result.Add(id, -10);
        }

        return Task.FromResult(result);
      });

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

    var controller = new EvaluationController(
      _fakeSignalRepository,
      _fakeAlarmRepository,
      _fakeProducer,
      provider,
      new EvaluationHelper(dateTimeProvider));

    // Act
    var result = controller.EvaluateBurgerSaldos(new List<string>() { "test-1" }, 0);

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
}
