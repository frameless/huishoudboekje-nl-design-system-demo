using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;
using FakeItEasy;

namespace BankServices.Tests.CsmServicesTests.CsmServiceTests;

public partial class CsmServiceTests
{
  [Test]
  public async Task GetPaged_CallsProducer()
  {
    //Arrange
    Pagination pagination = new(10, 10);
    string fileUuid = new Guid().ToString();
    HhbFile fakeFile = new()
    {
      UUID = fileUuid,
      Name = "TestFile"
    };
    ICsm fakeCsm = new Csm()
    {
      Transactions = [],
      File = fakeFile
    };
    Paged<ICsm> fakePaged = new()
    {
      Data = [fakeCsm],
      TotalCount = 1
    };

    A.CallTo(() => _fakeRepository.GetPaged(A<Pagination>.That.Matches(p => p.Skip.Equals(pagination.Skip) && p.Take.Equals(pagination.Take))))
      .Returns(fakePaged);
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.That.Matches(l => l.Count == 1 && l[0].Equals(fileUuid))))
      .Returns([fakeFile]);
    //Act
    var result = await _sut.GetPaged(pagination);
    //Assert
    A.CallTo(() => _fakeRepository.GetPaged(pagination)).MustHaveHappenedOnceExactly();
    A.CallTo(() => _fakeFileProducer.GetFiles(A<IList<string>>.That.Matches(l => l.Count == 1 && l[0].Equals(fileUuid)))).MustHaveHappenedOnceExactly();
  }
}
