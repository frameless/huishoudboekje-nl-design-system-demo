using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions;
using FakeItEasy;

namespace BankServices.Tests.CsmServicesTests.CsmServiceTests;

public partial class CsmServiceTests
{
  [Test]
  public async Task Upload_Correct()
  {
    //Arrange
    IHhbFile input = CsmTools.GenerateHhbFile();
    //Act
    await _sut.Upload(input);
    //Assert
    A.CallTo(() => _fakeFileProducer.Upload(A<HhbFile>.Ignored)).MustHaveHappened();
  }

  [Test]
  public async Task Upload_IncorrectCamtType()
  {
    // Arrange
    const string camtFileName = "incorrectCamtType.xml";
    IHhbFile input = CsmTools.GenerateHhbFile(camtFileName: camtFileName);
    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.Upload(input));
    A.CallTo(() => _fakeFileProducer.Upload(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public async Task Upload_LargestSize()
  {
    // Arrange
    const int twoMegabytes = 2000000;
    IHhbFile input = CsmTools.GenerateHhbFile(size: twoMegabytes);
    // Act
    await _sut.Upload(input);
    // Assert
    A.CallTo(() => _fakeFileProducer.Upload(A<HhbFile>.Ignored)).MustHaveHappened();
  }

  [Test]
  public void Upload_FileToLarge()
  {
    // Arrange
    const int largerThenTwoMegabytes = 2000001;
    IHhbFile input = CsmTools.GenerateHhbFile(size: largerThenTwoMegabytes);
    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.Upload(input));
    A.CallTo(() => _fakeFileProducer.Upload(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }


  [Test, TestCaseSource(nameof(incorrectFileExtensionsCsm))]
  public void Upload_IncorrectExtension(string fileName)
  {
    // Arrange
    IHhbFile input = CsmTools.GenerateHhbFile(fileName: fileName);
    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.Upload(input));
    A.CallTo(() => _fakeFileProducer.Upload(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }


  private static object[] incorrectFileExtensionsCsm =
  {
    new object[] { "Test.xmrgl" },
    new object[] { "test.txt" },
    new object[] { "test" },
    new object[] { "test.exe" },
    new object[] { "test.bat" },
    new object[] { "test.test" },
    new object[] { "test.yaml" },
  };
}
