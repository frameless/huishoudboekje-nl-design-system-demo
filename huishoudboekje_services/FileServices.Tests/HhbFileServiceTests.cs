using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using FakeItEasy;
using FileServices.Domain.Repositories;
using FileServices.Logic.Producers;
using FileServices.Logic.Services;
using FluentAssertions;

namespace FileServices.Tests;

public class HhbFileServiceTests
{
  private HhbFileService _sut;
  private IFilesRepository _fakeRepository;
  private INotifyProducer _fakeProducer;
  private IDateTimeProvider _fakeDateTimeProvider;

  [SetUp]
  public void Setup()
  {
    _fakeRepository = A.Fake<IFilesRepository>();
    _fakeProducer = A.Fake<INotifyProducer>();
    _fakeDateTimeProvider = A.Fake<IDateTimeProvider>();
    _sut = new HhbFileService(_fakeRepository, _fakeDateTimeProvider, _fakeProducer);
  }

  [Test]
  public async Task UploadFile_CSM_Correct()
  {
    // Arrange
    IHhbFile input = new HhbFile()
    {
      Name = "Test.xml",
      Bytes = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF],
      Type = FileType.CustomerStatementMessage,
      LastModified = 1681209176000,
      Size = 5046
    };
    IHhbFile output = new HhbFile()
    {
      Name = input.Name,
      Bytes = input.Bytes,
      Type = input.Type,
      LastModified = input.LastModified,
      Size = input.Size,
      UUID = "test-uuid",
      Sha256 = "55c53f5d490297900cefa825d0c8e8e9532ee8a118abe7d8570762cd38be9818",
      UploadedAt = 1712839029
    };
    A.CallTo(() => _fakeRepository.FileExists(A<string>.Ignored)).Returns(Task.FromResult(false));
    A.CallTo(() => _fakeRepository.Insert(A<IHhbFile>.Ignored)).Returns(Task.FromResult(output));
    A.CallTo(() => _fakeDateTimeProvider.UnixNow()).Returns(output.UploadedAt);

    // Act
    IHhbFile result = await _sut.UploadFile(input);

    // Assert
    A.CallTo(() => _fakeRepository.FileExists(A<string>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeRepository.Insert(A<HhbFile>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeProducer.NotifyFileUpload(A<HhbFile>.Ignored)).MustHaveHappenedOnceExactly();
    result.Should().BeEquivalentTo(output);
  }

  [Test]
  public void UploadFile_CSM_FileExists()
  {
    // Arrange
    IHhbFile input = new HhbFile()
    {
      Name = "Test.xml",
      Bytes = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF],
      Type = FileType.CustomerStatementMessage,
      LastModified = 1681209176000,
      Size = 5046
    };
    A.CallTo(() => _fakeRepository.FileExists(A<string>.Ignored)).Returns(Task.FromResult(true));
    // Act & Assert
    Assert.ThrowsAsync<HHBDataException>(async () => await _sut.UploadFile(input));
    A.CallTo(() => _fakeRepository.FileExists(A<string>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeRepository.Insert(A<HhbFile>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeProducer.NotifyFileUpload(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test, TestCaseSource(nameof(incorrectFileExtensionsCsm))]
  public void UploadFile_CSM_IncorrectExtension(string fileName)
  {
    // Arrange
    IHhbFile input = new HhbFile()
    {
      Name = fileName,
      Bytes = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF],
      Type = FileType.CustomerStatementMessage,
      LastModified = 1681209176000,
      Size = 5046
    };
    // Act & Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.UploadFile(input));
    A.CallTo(() => _fakeRepository.FileExists(A<string>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeRepository.Insert(A<HhbFile>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeProducer.NotifyFileUpload(A<HhbFile>.Ignored)).MustNotHaveHappened();
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
