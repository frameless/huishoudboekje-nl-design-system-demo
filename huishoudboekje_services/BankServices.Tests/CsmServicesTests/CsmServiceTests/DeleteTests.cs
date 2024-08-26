using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Notifications;
using Core.CommunicationModels.TransactionModels;
using FakeItEasy;

namespace BankServices.Tests.CsmServicesTests.CsmServiceTests;

public partial class CsmServiceTests
{
  [Test]
  public async Task DeleteCsm_Success()
  {
    //Arrange
    string csmUuid = Guid.NewGuid().ToString();
    string fileUuid = Guid.NewGuid().ToString();
    string fakeTransactionOneUuid = Guid.NewGuid().ToString();
    string fakeTransactionTwoUuid = Guid.NewGuid().ToString();

    TransactionModel fakeTransactionOne = new()
    {
      UUID = fakeTransactionOneUuid
    };
    TransactionModel fakeTransactionTwo = new()
    {
      UUID = fakeTransactionTwoUuid
    };

    ICsm fakeCsm = new Csm()
    {
      Transactions = [fakeTransactionOne, fakeTransactionTwo],
      AccountIdentification = "123324",
      TransactionReference = "12345678",
      File = new HhbFile()
      {
        UUID = fileUuid
      },
      UUID = csmUuid
    };

    A.CallTo(() => _fakeRepository.GetByIdWithTransactions(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Returns(fakeCsm);
    A.CallTo(() => _fakeRepository.DeleteNoSave(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Returns(true);
    //Act
    var result = await _sut.Delete(csmUuid);

    //Assert
    A.CallTo(() => _fakeRepository.DeleteNoSave(csmUuid)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeJournalEntryProducer.Delete(A<IList<string>>.That.Matches(input => input.Count == 2 && input.Contains(fakeTransactionOneUuid) && input.Contains(fakeTransactionTwoUuid)))).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeFileProducer.Delete(A<string>.That.Matches(input => input.Equals(fileUuid)))).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeRepository.SaveChanges()).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeNotificationProducer.Notify(A<Notification>.Ignored)).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task DeleteCsm_Fail()
  {
    //Arrange
    string csmUuid = Guid.NewGuid().ToString();
    string fileUuid = Guid.NewGuid().ToString();
    string fakeTransactionOneUuid = Guid.NewGuid().ToString();
    string fakeTransactionTwoUuid = Guid.NewGuid().ToString();

    TransactionModel fakeTransactionOne = new()
    {
      UUID = fakeTransactionOneUuid
    };
    TransactionModel fakeTransactionTwo = new()
    {
      UUID = fakeTransactionTwoUuid
    };

    ICsm fakeCsm = new Csm()
    {
      Transactions = [fakeTransactionOne, fakeTransactionTwo],
      AccountIdentification = "123324",
      TransactionReference = "12345678",
      File = new HhbFile()
      {
        UUID = fileUuid
      },
      UUID = csmUuid
    };

    A.CallTo(() => _fakeRepository.GetByIdWithTransactions(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Returns(fakeCsm);
    A.CallTo(() => _fakeRepository.DeleteNoSave(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Returns(false);
    //Act
    var result = await _sut.Delete(csmUuid);

    //Assert
    A.CallTo(() => _fakeRepository.DeleteNoSave(csmUuid)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeJournalEntryProducer.Delete(A<IList<string>>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeFileProducer.Delete(A<string>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeRepository.SaveChanges()).MustNotHaveHappened();
    A.CallTo(() => _fakeNotificationProducer.Notify(A<Notification>.Ignored)).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task DeleteCsm_Errors()
  {
    //Arrange
    string csmUuid = Guid.NewGuid().ToString();
    string fileUuid = Guid.NewGuid().ToString();
    string fakeTransactionOneUuid = Guid.NewGuid().ToString();
    string fakeTransactionTwoUuid = Guid.NewGuid().ToString();

    TransactionModel fakeTransactionOne = new()
    {
      UUID = fakeTransactionOneUuid
    };
    TransactionModel fakeTransactionTwo = new()
    {
      UUID = fakeTransactionTwoUuid
    };

    ICsm fakeCsm = new Csm()
    {
      Transactions = [fakeTransactionOne, fakeTransactionTwo],
      AccountIdentification = "123324",
      TransactionReference = "12345678",
      File = new HhbFile()
      {
        UUID = fileUuid
      },
      UUID = csmUuid
    };

    A.CallTo(() => _fakeRepository.GetByIdWithTransactions(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Returns(fakeCsm);
    A.CallTo(() => _fakeRepository.DeleteNoSave(A<string>.That.Matches(input => input.Equals(csmUuid))))
      .Throws(new Exception());
    //Act
    Assert.ThrowsAsync<Exception>(async () => await _sut.Delete(csmUuid));

    //Assert
    A.CallTo(() => _fakeRepository.DeleteNoSave(csmUuid)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeJournalEntryProducer.Delete(A<IList<string>>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeFileProducer.Delete(A<string>.Ignored)).MustNotHaveHappened();
    A.CallTo(() => _fakeRepository.SaveChanges()).MustNotHaveHappened();
    A.CallTo(() => _fakeNotificationProducer.Notify(A<Notification>.Ignored)).MustNotHaveHappened();
  }
}
