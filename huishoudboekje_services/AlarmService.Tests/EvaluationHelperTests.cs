using AlarmService.Domain.Repositories.Interfaces;
using AlarmService.Logic.AlarmEvaluation;
using AlarmService.Logic.Controllers.Evaluation;
using AlarmService.Logic.Misc;
using Core.CommunicationModels;
using Core.CommunicationModels.AlarmModels;
using Core.CommunicationModels.AlarmModels.Interfaces;
using Core.CommunicationModels.JournalEntryModel;
using Core.CommunicationModels.JournalEntryModel.Interfaces;
using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.DataTypes;
using Core.utils.DateTimeProvider;
using FakeItEasy;

namespace AlarmService.Tests;

public class EvaluationHelperTests
{
  private EvaluationHelper _sut;
  private DateTimeProvider dateTimeProvider;
  [SetUp]
  public void Setup()
  {
    dateTimeProvider = new DateTimeProvider();
    _sut = new EvaluationHelper(new DateTimeProvider());
  }

  [TestCaseSource(nameof(DetermineFirstCheckOnDateCases))]
  public void EvaluationHelper_DetermineFirstCheckOnDate(AlarmModel alarm, long expected)
  {
    // Arrange
    // Act
    var result = _sut.DetermineFirstCheckOnDate(dateTimeProvider.UnixToDateTime(alarm.StartDate), alarm);

    // Assert
    if (expected == 0)
    {
      Assert.That(result, Is.Null);
    }
    else
    {
      Assert.That(result, Is.EqualTo((long)expected));
    }
  }

  public static object[] DetermineFirstCheckOnDateCases =
  {
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [23],
        RecurringDay = null,
        StartDate = 1706262983, // 26-01-2024
        EndDate = null,
        CheckOnDate = null
      },
      1708905600 //26-02-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13, 23],
        RecurringDay = null,
        StartDate = 1706262983, // 26-01-2024
        EndDate = null,
        CheckOnDate = null
      },
      1708041600 //16-02-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 4, 7, 10],
        RecurringDayOfMonth = [23],
        RecurringDay = null,
        StartDate = 1708560000, // 22-02-2024
        EndDate = null,
        CheckOnDate = null
      },
      1714089600 //26-04-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [27],
        RecurringDay = null,
        StartDate = 1709164800, // 29-02-2024
        EndDate = null,
        CheckOnDate = null
      },
      1709251200 // 01-03-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13, 27],
        RecurringDay = null,
        StartDate = 1709164800, // 29-02-2024
        EndDate = null,
        CheckOnDate = null
      },
      1709251200 // 01-03-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 2,
        RecurringMonths = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13, 26],
        RecurringDay = null,
        StartDate = 1709164800, // 29-02-2024
        EndDate = null,
        CheckOnDate = null
      },
      1713225600 // 16-04-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 4,
        DateMargin = 1,
        RecurringMonths = [2],
        RecurringDayOfMonth = [27],
        RecurringDay = null,
        StartDate = 1708560000, // 22-02-2024
        EndDate = null,
        CheckOnDate = null
      },
      1709164800 // 29-02-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 4,
        DateMargin = 1,
        RecurringMonths = [2],
        RecurringDayOfMonth = [27],
        RecurringDay = null,
        StartDate = 1711065600, // 22-03-2024
        EndDate = null,
        CheckOnDate = null
      },
      1740787200 //01-03-2025
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 4,
        DateMargin = 2,
        RecurringMonths = [1],
        RecurringDayOfMonth = [22],
        RecurringDay = null,
        StartDate = 1706262983, // 26-01-2024
        EndDate = null,
        CheckOnDate = null
      },
      1737763200 // 25-01-2025
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 1,
        RecurringMonths = [1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13, 26],
        RecurringDay = null,
        StartDate = 1717995600, // 10-06-2024
        EndDate = null,
        CheckOnDate = null
      },
      1718409600 // 15-06-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 1,
        RecurringMonths = [1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13],
        RecurringDay = null,
        StartDate = 1733824800, // 10-12-2024
        EndDate = null,
        CheckOnDate = null
      },
      1734220800 // 15-12-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 1,
        DateMargin = 1,
        RecurringMonths = [1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12],
        RecurringDayOfMonth = [13],
        RecurringDay = null,
        StartDate = 1734325200, // 16-12-2024
        EndDate = null,
        CheckOnDate = null
      },
      1736899200 // 15-12-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 2,
        DateMargin = 1,
        RecurringMonths = null,
        RecurringDayOfMonth = null,
        RecurringDay = [2],
        StartDate = 1734325200, // 16-12-2024
        EndDate = null,
        CheckOnDate = null
      },
      1734566400 // 19-12-2024
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 2,
        DateMargin = 1,
        RecurringMonths = null,
        RecurringDayOfMonth = null,
        RecurringDay = [2],
        StartDate = 1735441200, // 29-12-2024
        EndDate = null,
        CheckOnDate = null
      },
      1735776000 // 02-01-2025
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 2,
        DateMargin = 1,
        RecurringMonths = null,
        RecurringDayOfMonth = null,
        RecurringDay = [2],
        StartDate = 1735441200, // 29-12-2024
        EndDate = 1735527600, // 30-12-2024
        CheckOnDate = null
      },
      0
    },
    new object[]
    {
      new AlarmModel()
      {
        UUID = "test-1",
        AlarmType = 3,
        DateMargin = 1,
        RecurringMonths = null,
        RecurringDayOfMonth = null,
        RecurringDay = null,
        StartDate = 1720688400, // 11-07-2024 + some hours
        EndDate = 1720688400, // 11-07-2024 + some hours
        CheckOnDate = null
      },
      1720828800 // 13-07-2024 midnight GMT
    }
  };
}
