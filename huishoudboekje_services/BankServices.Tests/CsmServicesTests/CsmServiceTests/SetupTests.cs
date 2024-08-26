using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices;
using BankServices.Logic.Services.PaymentRecordService.Interfaces;
using FakeItEasy;

namespace BankServices.Tests.CsmServicesTests.CsmServiceTests;

public partial class CsmServiceTests
{
  private CsmService _sut;
  private IFileProducer _fakeFileProducer;
  private ICsmRepository _fakeRepository;
  private IJournalEntryProducer _fakeJournalEntryProducer;
  private INotificationProducer _fakeNotificationProducer;
  private IPaymentRecordService _fakePaymentRecordService;
  private ISignalProducer _fakeSignalProducer;

  [SetUp]
  public void Setup()
  {
    _fakeFileProducer = A.Fake<IFileProducer>();
    _fakeRepository = A.Fake<ICsmRepository>();
    _fakeJournalEntryProducer = A.Fake<IJournalEntryProducer>();
    _fakeNotificationProducer = A.Fake<INotificationProducer>();
    _fakePaymentRecordService = A.Fake<IPaymentRecordService>();
    _fakeSignalProducer = A.Fake<ISignalProducer>();
    _sut = new CsmService(_fakeFileProducer, _fakeSignalProducer, _fakeRepository, _fakeNotificationProducer, _fakeJournalEntryProducer, _fakePaymentRecordService);
  }
}
