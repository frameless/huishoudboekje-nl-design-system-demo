using FakeItEasy;
using UserApi.Producers.Interfaces;
using UserApi.Services;
using UserApi.Services.BsnServices;

namespace UserApi.Tests.Services;

public class BsnServiceTests
{
  private ICheckBsnProducer _fakeproducer;
  private BsnService _sut;

  [SetUp]
  public void Setup()
  {
    _fakeproducer = A.Fake<ICheckBsnProducer>();
    _sut = new BsnService(_fakeproducer);
  }

  [Test]
  public void BsnIsAllowedTest()
  {
    //Arrange
    const string bsn = "75450835";
    //Act
    _sut.IsAllowed(bsn);
    //Assert
    A.CallTo(() => _fakeproducer.RequestCheckBsn(bsn)).MustHaveHappenedOnceExactly();
  }

  [Test, TestCaseSource(nameof(bsnValidateCases))]
  public async Task BsnValidateTest(string bsn, bool isValid)
  {
    //Act
    var result = await _sut.Validate(bsn);
    //Asset
    Assert.That(result, Is.EqualTo(isValid));
  }

  private static object[] bsnValidateCases =
  {
    new object[] { "1234567", false },
    new object[] { "1234567890", false },
    new object[] { "1", false },
    new object[] { "1234567890000", false },
    new object[] { "-1", false },
    new object[] { "-1234567", false },
    new object[] { "-12345678", false },
    new object[] { "-123456789", false },
    new object[] { "ThisIsANumber", false },
    new object[] { "!^$@$$))@&%)@%", false },
    new object[] { "370790806", false },
    new object[] { "75450834", false },
    new object[] { "370790807", true },
    new object[] { "75450835", true }
  };
}
