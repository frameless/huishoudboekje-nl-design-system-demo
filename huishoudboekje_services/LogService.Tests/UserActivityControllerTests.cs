using Core.CommunicationModels;
using Core.CommunicationModels.LogModels;
using Core.CommunicationModels.LogModels.Interfaces;
using FakeItEasy;
using FluentAssertions;
using LogService.Controllers.Controllers.UserActivities;
using LogService.Database.Repositories;

namespace LogService.Tests;

public class UserActivityControllerTests
{
  private IUserActivitiesRepository _fakeRepository;
  private UserActivitiesController _sut;
  private readonly IUserActivityFilter? NOFILTERS = null;

  // Example data

  #region

  private IList<IUserActivityLog> exampleUserActivityLogs = new List<IUserActivityLog>()
  {
    new UserActivity()
    {
      Timestamp = 1696251159,
      UserId = "6921eb94-0c4b-459e-89e2-4ff246615adf",
      Action = "createConfiguratie",
      Entities = new List<IUserActivityEntity>
      {
        new UserActivityEntity()
        {
          EntityId = "derdengeldenrekening_rekeninghouder",
          EntityType = "configuratie"
        }
      },
      SnapshotBefore = null,
      SnapshotAfter =
        "{\"configuratie\": { \"id\": \"derdengeldenrekening_rekeninghouder\", \"waarde\": \"Gemeente Sloothuizen Huishoudboekje\"}",
      Meta = "",
      UUID = "86db6f48-f137-4c25-9c5f-bf3199466162"
    },
    new UserActivity()
    {
      Timestamp = 1690973488,
      UserId = "6921eb94-0c4b-459e-89e2-4ff246615adf",
      Action = "createConfiguratie",
      Entities = new List<IUserActivityEntity>
      {
        new UserActivityEntity
        {
          EntityId = "derdengeldenrekening_rekeninghouder",
          EntityType = "configuratie"
        }
      },
      SnapshotBefore = null,
      SnapshotAfter =
        "{\"configuratie\": { \"id\": \"derdengeldenrekening_rekeninghouder\", \"waarde\": \"Gemeente Sloothuizen Huishoudboekje\"}",
      Meta = "",
      UUID = "e6976722-f86e-467d-b9fe-5dc70ef579ae"
    }
  };

  #endregion

  private IUserActivitiesRepository FakeRepo()
  {
    return A.Fake<IUserActivitiesRepository>();
  }

  [SetUp]
  public void Setup()
  {
    _fakeRepository = FakeRepo();
    _sut = new UserActivitiesController(_fakeRepository);
  }

  [Test]
  public void GettingAllItems_FromController_ShouldReturnAllItemsAsIUserActivity()
  {
    // Arrange
    IList<IUserActivityLog> expected = exampleUserActivityLogs;
    A.CallTo(() => _fakeRepository.GetAll(NOFILTERS)).Returns(Task.FromResult(expected));

    // Act
    var result = _sut.GetAllItems(NOFILTERS).Result;

    // Assert
    A.CallTo(() => _fakeRepository.GetAll(NOFILTERS)).MustHaveHappenedOnceExactly();
    result.Should().BeEquivalentTo(expected);
  }

  [Test]
  public void GettingAllItems_FromController_WithFilter_ShouldReturnAllItemsAsIUserActivity()
  {
    // Arrange
    IList<IUserActivityLog> expected = exampleUserActivityLogs;
    var filter = new UserActivityFilter()
    {
      EntityFilters =
        new List<IUserActivityEntityFilter>()
        {
          new UserActivityEntityFilter()
          {
            EntityIds = new List<string> { "26db6f48-f137-4c25-9c5f-bf3199466162" },
            EntityType = "Configuratie"
          }
        }
    };
    A.CallTo(() => _fakeRepository.GetAll(filter)).Returns(Task.FromResult(expected));

    // Act
    var result = _sut.GetAllItems(filter).Result;

    // Assert
    A.CallTo(() => _fakeRepository.GetAll(filter)).MustHaveHappenedOnceExactly();
    result.Should().BeEquivalentTo(expected);
  }

  [Test]
  public void GettingAllItems_FromController_ThrowsError()
  {
    // Arrange
    A.CallTo(() => _fakeRepository.GetAll(NOFILTERS)).Throws(new Exception());

    // Act & Assert
    Assert.ThrowsAsync<Exception>(async () => await _sut.GetAllItems(NOFILTERS));
  }

  [Test]
  public void GettingPagedItems_FromControllerWithPageInfo_ShouldReturnPagedItems()
  {
    // Arrange
    Paged<IUserActivityLog> expected1 = new Paged<IUserActivityLog>(
      new List<IUserActivityLog>() { exampleUserActivityLogs[0] },
      1);
    Paged<IUserActivityLog> expected2 = new Paged<IUserActivityLog>(
      new List<IUserActivityLog>() { exampleUserActivityLogs[1] },
      1);
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 0), NOFILTERS))
      .Returns(Task.FromResult(expected1));
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 1), NOFILTERS))
      .Returns(Task.FromResult(expected2));

    // Act
    var result1 = _sut.GetItemsPaged(new Pagination(1, 0), NOFILTERS).Result;
    var result2 = _sut.GetItemsPaged(new Pagination(1, 1), NOFILTERS).Result;

    // Assert
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 0), NOFILTERS))
      .MustHaveHappened();
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 1), NOFILTERS))
      .MustHaveHappened();
    result1.Should().NotBeEquivalentTo(result2);
    result1.Should().BeEquivalentTo(expected1);
    result2.Should().BeEquivalentTo(expected2);
  }

  [Test]
  public void GettingPagedItems_FromControllerWithPageInfo_WithFilters_ShouldReturnPagedItems()
  {
    // Arrange
    Paged<IUserActivityLog> expected1 = new Paged<IUserActivityLog>(
      [exampleUserActivityLogs[0]],
      1);
    var filter = new UserActivityFilter()
    {
      EntityFilters =
        new List<IUserActivityEntityFilter>()
        {
          new UserActivityEntityFilter()
          {
            EntityIds = new List<string> { "26db6f48-f137-4c25-9c5f-bf3199466162" },
            EntityType = "Configuratie"
          }
        }
    };

    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 0), filter))
      .Returns(Task.FromResult(expected1));

    // Act
    var result1 = _sut.GetItemsPaged(
      new Pagination(1, 0),
      filter).Result;

    // Assert
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Take == 1 && p.Skip == 0), filter))
      .MustHaveHappened();
    result1.Should().BeEquivalentTo(expected1);
  }

  [Test]
  public void GettingPagedItems_FromControllerWithPageInfo_ThrowsError()
  {
    // Arrange
    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.Ignored, NOFILTERS)).Throws(new Exception());

    // Act & Assert
    Assert.ThrowsAsync<Exception>(async () => await _sut.GetItemsPaged(new Pagination(1, 1), NOFILTERS));
  }

  // [Test]
  // public void GettingItemsById_FromControllerWithCorrectId_ShouldReturnItemWithID()
  // {
  //   // Arrange
  //   var expected1 = exampleUserActivityLogs[0];
  //   A.CallTo(() => _fakeRepository.GetById(A<string>.That.Matches(id => id == "86db6f48-f137-4c25-9c5f-bf3199466162")))
  //     .Returns(expected1);
  //
  //   // Act
  //   var result1 = _sut.GetById("86db6f48-f137-4c25-9c5f-bf3199466162").Result;
  //
  //   // Assert
  //   A.CallTo(() => _fakeRepository.GetById(A<string>.That.Matches(id => id == "86db6f48-f137-4c25-9c5f-bf3199466162")))
  //     .MustHaveHappened();
  //   result1.Should().BeEquivalentTo(expected1);
  // }
  //
  // [Test]
  // public void GettingItemsById_FromControllerWithId_ThrowsError()
  // {
  //   // Arrange
  //   A.CallTo(() => _fakeRepository.GetById(A<string>.That.Matches(id => id == "86db6f48-f137-4c25-9c5f-bf3199466162")))
  //     .Throws(new Exception());
  //
  //   // Act & Assert
  //   Assert.ThrowsAsync<Exception>(async () => await _sut.GetById("86db6f48-f137-4c25-9c5f-bf3199466162"));
  // }

  [Test]
  public void GetMultipleById_FromControllerWithCorrectIds_ShouldReturnItemWithID()
  {
    // Arrange
    IList<IUserActivityLog> expected1 = exampleUserActivityLogs;
    IList<string> idList = new List<string>
      { "86db6f48-f137-4c25-9c5f-bf3199466162", "e6976722-f86e-467d-b9fe-5dc70ef579ae" };
    A.CallTo(
        () => _fakeRepository.GetMultipleById(
          A<IList<string>>.That.Matches(
            ids => ids.Contains("86db6f48-f137-4c25-9c5f-bf3199466162")
                   && ids.Contains("e6976722-f86e-467d-b9fe-5dc70ef579ae"))))
      .Returns(expected1);

    // Act
    var result1 = _sut.GetMultipleById(idList).Result;

    // Assert
    A.CallTo(
        () => _fakeRepository.GetMultipleById(
          A<IList<string>>.That.Matches(
            ids => ids.Contains("86db6f48-f137-4c25-9c5f-bf3199466162")
                   && ids.Contains("e6976722-f86e-467d-b9fe-5dc70ef579ae"))))
      .MustHaveHappened();
    result1.Should().BeEquivalentTo(expected1);
  }

  [Test]
  public void GetMultipleById_FromControllerWithId_ThrowsError()
  {
    // Arrange
    A.CallTo(() => _fakeRepository.GetMultipleById(A<IList<string>>.Ignored))
      .Throws(new Exception());

    // Act & Assert
    Assert.ThrowsAsync<Exception>(
      async () => await _sut.GetMultipleById(new List<string> { "86db6f48-f137-4c25-9c5f-bf3199466162" }));
  }

  [Test]
  public async Task AddItem_FromControllerWithCorrectIds_ShouldCallRepo()
  {
    // Arrange
    IUserActivityLog insertedItem = exampleUserActivityLogs[0];

    // Act
    await _sut.AddItem(insertedItem);

    // Assert
    A.CallTo(() => _fakeRepository.Insert(insertedItem))
      .MustHaveHappened();
  }
}
