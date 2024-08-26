
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.PaymentExportServices;
using BankServices.Logic.Services.PaymentRecordService;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using FakeItEasy;

namespace BankServices.Tests.PaymentExportServicesTests;

public class PaymentExportServiceTests
{
  private PaymentExportService _sut;
  private IPaymentExportRepository _fakePaymentExportRepository;
  private IPaymentRecordService _fakePaymentRecordService;
  private ICreatePaymentInstructionFileProducer _fakePaymentInstructionFileProducer;
  private IFileProducer _fakeFileProducer;

  [SetUp]
  public void Setup()
  {
    _fakePaymentExportRepository = A.Fake<IPaymentExportRepository>();
    _fakePaymentRecordService = A.Fake<IPaymentRecordService>();
    _fakePaymentInstructionFileProducer = A.Fake<ICreatePaymentInstructionFileProducer>();
    _fakeFileProducer = A.Fake<IFileProducer>();
    _sut = new PaymentExportService(_fakePaymentExportRepository, _fakePaymentRecordService, _fakePaymentInstructionFileProducer, _fakeFileProducer, new DateTimeProvider());
  }

  [Test]
  public async Task CreateExport_HappyFlow()
  {
    //Arrange
    string expectedExportuuid = "exportUuid";
    IList<string> recordIds = ["recorduuid"];
    long startDate = 123456678;
    long endDate = 123456679;
    IHhbFile fakeFile = new HhbFile()
    {
      UploadedAt = 12345,
      UUID = "fileuuid",
      Sha256 = "sha256"
    };
    A.CallTo(() => _fakePaymentRecordService.GetByIds(A<IList<string>>.Ignored))
      .Returns(Task.FromResult<IList<IPaymentRecord>>(
      [new PaymentRecord()
        {
          UUID = "recorduuid"
        }
      ]));
    A.CallTo(() => _fakePaymentInstructionFileProducer.CreatePaymentInstructionFile(A<IList<IPaymentRecord>>.Ignored))
      .Returns(Task.FromResult<IHhbFile>(fakeFile));
    A.CallTo(() => _fakePaymentExportRepository.Add(A<IPaymentExport>.Ignored)).Returns(Task.FromResult<IPaymentExport>(new PaymentExport(){
      Uuid = expectedExportuuid
    }));

    //Act
    string result = await _sut.CreateExport(recordIds, startDate, endDate);

    //Assert
    Assert.That(result, Is.EqualTo(expectedExportuuid));
    A.CallTo(() => _fakePaymentRecordService.GetByIds(A<IList<string>>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakePaymentInstructionFileProducer.CreatePaymentInstructionFile(A<IList<IPaymentRecord>>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakePaymentExportRepository.Add(A<IPaymentExport>.Ignored)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakePaymentRecordService.UpdateMany(A<IList<IPaymentRecord>>.That.Matches(list => list.All(record => record.PaymentExportUuid.Equals(expectedExportuuid))))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task GetPaged_HappyFlow()
  {
    //Arrange
    int skip = 15;
    int take = 10;
    Pagination page = new(take, skip);
    A.CallTo(() => _fakePaymentExportRepository.GetPaged(A<Pagination>.Ignored))
      .Returns(Task.FromResult<Paged<IPaymentExport>>(new Paged<IPaymentExport>()));

    //Act
    Paged<IPaymentExport> result = await _sut.GetPaged(page);

    //Assert
    A.CallTo(() => _fakePaymentExportRepository.GetPaged(A<Pagination>.That.Matches(pagination => pagination.Skip.Equals(skip) && pagination.Take.Equals(take)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task GetFile_HappyFlow()
  {
    //Arrange
    string exportUuid = "exportuuid";
    string fileUuid = "fileuuid";
    A.CallTo(() => _fakePaymentExportRepository.GetById(A<string>.That.Matches(id => id.Equals(exportUuid)), A<bool>.Ignored))
      .Returns(Task.FromResult<IPaymentExport>(new PaymentExport()
      {
        Uuid = exportUuid,
        FileUuid = fileUuid
      }));
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.Ignored))
      .Returns(Task.FromResult<IList<IHhbFile>>([new HhbFile()
      {
        UUID = fileUuid
      }]));

    //Act
    IHhbFile result = await _sut.GetFile(exportUuid);

    //Assert
    Assert.That(result.UUID, Is.EqualTo(fileUuid));
    A.CallTo(() => _fakePaymentExportRepository.GetById(A<string>.That.Matches(id => id.Equals(exportUuid)), A<bool>.Ignored))
      .MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.Ignored)).MustHaveHappenedOnceExactly();
  }


  [Test]
  public async Task GetFile_OtherThenOneFIleReturned_Errors()
  {
    //Arrange
    string exportUuid = "exportuuid";
    string fileUuid = "fileuuid";
    A.CallTo(() => _fakePaymentExportRepository.GetById(A<string>.That.Matches(id => id.Equals(exportUuid)), A<bool>.Ignored))
      .Returns(Task.FromResult<IPaymentExport>(new PaymentExport()
      {
        Uuid = exportUuid,
        FileUuid = fileUuid
      }));
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.Ignored))
      .Returns(Task.FromResult<IList<IHhbFile>>([]));

    //Act && Assert
    Assert.ThrowsAsync<HHBDataException>(async () => await _sut.GetFile(exportUuid));
    A.CallTo(() => _fakePaymentExportRepository.GetById(A<string>.That.Matches(id => id.Equals(exportUuid)), A<bool>.Ignored))
      .MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.Ignored)).MustHaveHappenedOnceExactly();
  }
}
