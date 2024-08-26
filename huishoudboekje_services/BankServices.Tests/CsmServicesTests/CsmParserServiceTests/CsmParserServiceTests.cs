using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices;
using BankServices.Logic.Services.CsmServices.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using FakeItEasy;
using MassTransit;

namespace BankServices.Tests.CsmServicesTests.CsmParserServiceTests;

public class CsmParserServiceTests
{
  private CsmParserService _sut;
  private ICsmService _fakeCsmService;
  private IConfigurationProducer _fakeConfigurationProducer;
  private IPublishEndpoint _fakePublishEndpoint;
  private IReconciliationProducer _fakeReconciliationProducer;

  [SetUp]
  public void Setup()
  {
    _fakeCsmService = A.Fake<ICsmService>();
    _fakeConfigurationProducer = A.Fake<IConfigurationProducer>();
    _fakePublishEndpoint = A.Fake<IPublishEndpoint>();
    _fakeReconciliationProducer = A.Fake<IReconciliationProducer>();
    A.CallTo(() => _fakeConfigurationProducer.GetAccountIban())
      .Returns("NL58ARTE0830054138");
    _sut = new CsmParserService(_fakeCsmService, new DateTimeProvider(), _fakeConfigurationProducer, _fakePublishEndpoint, _fakeReconciliationProducer);
  }

  [Test]
  public async Task ParseCamtFileStartsReconciliation()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_AccountIdentification_Iban.xml");
    const string expectedAccountIdentification = "NL58ARTE0830054138";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeReconciliationProducer.StartReconciliation(A<string>.Ignored)).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileIbanAccountIdentification()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_AccountIdentification_Iban.xml");
    const string expectedAccountIdentification = "NL58ARTE0830054138";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedAccountIdentification.Equals(csm.AccountIdentification)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileIdAccountIdentification()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_AccountIdentification_Id.xml");
    const string expectedAccountIdentification = "105084986";
    A.CallTo(() => _fakeConfigurationProducer.GetAccountIban())
      .Returns(expectedAccountIdentification);
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedAccountIdentification.Equals(csm.AccountIdentification)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileTransactionReference()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_TransactionReference.xml");
    const string expectedTransactionReference = "15111000";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedTransactionReference.Equals(csm.TransactionReference)))).MustHaveHappenedOnceExactly();
  }


  [Test]
  public async Task ParseCamtFileOneTransactionAmountPositive()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_Amount_Positive.xml");
    const bool expectedIsCredit = true;
    const int expectedAmount = 12379;
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedAmount == csm.Transactions[0].Amount && expectedIsCredit == csm.Transactions[0].IsCredit))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionAmountNegative()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_Amount_Negative.xml");
    const bool expectedIsCredit = false;
    const int expectedAmount = -14545;
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedAmount == csm.Transactions[0].Amount && expectedIsCredit == csm.Transactions[0].IsCredit))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionOnlyFirstAmountTag()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_OnlyFirstTag_Amount.xml");
    const int expectedAmount = -14845;
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedAmount == csm.Transactions[0].Amount))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionCorrectFromAccountCrdtAccount()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_CrdtAccount.xml");
    const string expectedFromAccount = "NL91INGB0003000047";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedFromAccount.Equals(csm.Transactions[0].FromAccount)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionCorrectFromAccountDbitAccount()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_DbitAccount.xml");
    const string expectedFromAccount = "NL84TRIO0371628806";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedFromAccount.Equals(csm.Transactions[0].FromAccount)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionCorrectFromAccountNoAccount()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One_NoAccount.xml");
    const string? expectedFromAccount = null;
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => csm.Transactions[0].FromAccount == expectedFromAccount))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionCorrectDate()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One.xml");
    const long expectedDate = 1644192000;
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => expectedDate == csm.Transactions[0].Date))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public async Task ParseCamtFileOneTransactionCorrectDescription()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One.xml");
    const string expectedDescription = "/TRTP/SEPA Incasso/REMI/PREMIE Zorg/CSID/NL12ZZZ091567230000/SVCL/CORE PREMIE aug. 2023. 123456789 5784272";
    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => csm.Transactions[0].InformationToAccountOwner.Equals(expectedDescription)))).MustHaveHappenedOnceExactly();
  }

  [Test]
  public void ParseCamtFileIncorrectAccount()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One.xml");
    A.CallTo(() => _fakeConfigurationProducer.GetAccountIban())
      .Returns("something random");
    // Act & Assert
    Assert.ThrowsAsync<HHBDataException>(() => _sut.Parse(file));
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public void ParseCamtFileTransactionReferenceAlreadyExists()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_One.xml");
    A.CallTo(() => _fakeCsmService.TransactionReferenceExists(A<string>.Ignored))
      .Returns(Task.FromResult(true));

    // Act & Assert
    Assert.ThrowsAsync<HHBDataException>(() => _sut.Parse(file));
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public async Task ParseCamtFileTwoTransactionsCorrect()
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: "camt053_Transactions_Two.xml");
    ICsm expected = new Csm()
    {
      File = file,
      AccountIdentification = "NL58ARTE0830054138",
      TransactionReference = "15111000",
      Transactions =
      [
        new TransactionModel()
        {
          Amount = -14945,
          IsCredit = false,
          FromAccount = "NL91INGB0003000047",
          Date = 1644192000,
          InformationToAccountOwner =
            "/TRTP/SEPA Incasso/REMI/PREMIE Zorg/CSID/NL12ZZZ091567230000/SVCL/CORE PREMIE aug. 2023. 123456789 5784272"
        },
        new TransactionModel()
        {
          Amount = 104259,
          IsCredit = true,
          FromAccount = "NL92INGB0003000047",
          Date = 1678233600,
          InformationToAccountOwner =
            "/TRTP/SEPAAA TEST Incasso/REMI/PREMIE Zorg/CSID/NL12ZZZ091567230000/SVCL/CORE 987654321 PREMIE aug. 2026. 2462485"
        }
      ]
    };

    //Act
    await _sut.Parse(file);
    //Assert
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.That.Matches(csm => AssertCsmEquals(csm, expected)))).MustHaveHappenedOnceExactly();
  }

  private static bool AssertCsmEquals(ICsm csm, ICsm expected)
  {
    IList<bool> assertions = [];
    assertions.Add(csm.AccountIdentification.Equals(expected.AccountIdentification));
    assertions.Add(csm.TransactionReference.Equals(expected.TransactionReference));
    for (int i = 0; i < csm.Transactions.Count; i++)
    {
      ITransactionModel actualTransaction = csm.Transactions[i];
      ITransactionModel expectedTransaction = expected.Transactions[i];
      assertions.Add(actualTransaction.IsCredit.Equals(expectedTransaction.IsCredit));
      assertions.Add(actualTransaction.FromAccount.Equals(expectedTransaction.FromAccount));
      assertions.Add(actualTransaction.Amount.Equals(expectedTransaction.Amount));
      assertions.Add(actualTransaction.Date.Equals(expectedTransaction.Date));
    }
    return assertions.All(assertion => assertion);
  }

  [Test, TestCaseSource(nameof(csmFilesOneTransactionWithErrors))]
  public void ParseCamtFileOneTransactionThrowsError(string camtFileName)
  {
    //Arrange
    IHhbFile file = CsmTools.GenerateHhbFile(camtFileName: camtFileName);
    // Act & Assert
    Assert.ThrowsAsync<HHBParsingException>(() => _sut.Parse(file));
    A.CallTo(() => _fakeCsmService.Create(A<ICsm>.Ignored)).MustNotHaveHappened();
  }


  private static object[] csmFilesOneTransactionWithErrors =
  {
    new object[] { "camt053_TransactionReference_Missing.xml" },
    new object[] { "camt053_Transactions_One_OnlyTxtAmntTag_Amount.xml" },
    new object[] { "camt053_Transactions_One_Missing_Amount.xml" },
    new object[] { "camt053_Transactions_One_Missing_AmountAndCdtDbtInd.xml" },
    new object[] { "camt053_Transactions_One_MissingCdtDbtInd.xml" },
    new object[] { "camt053_Transactions_One_MissingDate.xml" },
    new object[] { "camt053_AccountIdentification_Missing.xml" },
    new object[] { "camt053_Transactions_One_MissingDescriptions.xml" }
  };
}
