using System.Text;
using System.Xml.Linq;
using Core.CommunicationModels.Configuration;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;
using FakeItEasy;
using FileServices.Logic.Services;
using FileServices.Logic.Services.PaymentInstructionServices;

namespace FileServices.Tests.Services.PaymentInstructionServices;

public class PaymentInstructionsServiceTests
{
  private PaymentInstructionsService _sut;
  private IHhbFileService _fakeFileservice;
  private IDateTimeProvider _fakeDateTimeProvider;
  private IDateTimeProvider _realDateTimeProvider;

  private const long UNIXTODAY = 1719408168;
  private const long UNIXPROCESSINGDATE = 1719508168;
  private const string STRINGPROCESSIGNDATE = "2024-06-27";
  private ConfigurationAccountConfig defaultConfig = new("Gemeente Test", "NL36DEUT0174690436", "ABNANL2A");

  [SetUp]
  public void Setup()
  {
    _fakeFileservice = A.Fake<IHhbFileService>();
    _fakeDateTimeProvider = A.Fake<IDateTimeProvider>();
    _realDateTimeProvider = new DateTimeProvider();

    _sut = new PaymentInstructionsService(_fakeFileservice, _fakeDateTimeProvider);

    A.CallTo(() => _fakeDateTimeProvider.UnixNow()).Returns(UNIXTODAY);
    A.CallTo(() => _fakeFileservice.UploadFile(A<HhbFile>.Ignored)).ReturnsLazily(x => Task.FromResult((IHhbFile) x.Arguments[0]));
    A.CallTo(() => _fakeDateTimeProvider.UnixToDateTime(A<long>.Ignored)).ReturnsLazily(x => _realDateTimeProvider.UnixToDateTime((long)x.Arguments[0]));
    A.CallTo(() => _fakeDateTimeProvider.Today()).ReturnsLazily(x => _realDateTimeProvider.UnixToDateTime(UNIXTODAY));
  }

  [Test]
  public void CreatePaymentInstructionsExport_InCorrectIbanTransaction_ThrowsError()
  {
    //Arrange
    PaymentRecord record = GetPaymentRecord(iban: "JHAFLGIHAERKIGUHALEIWUG");
    //Act && Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.CreatePaymentInstructionsExport([record], defaultConfig));
    A.CallTo(() => _fakeFileservice.UploadFile(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public void CreatePaymentInstructionsExport_InCorrectIbanConfig_ThrowsError()
  {
    //Arrange
    ConfigurationAccountConfig config = new("Gemeente Test", "JHAFLGIHAERKIGUHALEIWUG", "ABNANL2A");

    //Act && Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.CreatePaymentInstructionsExport([GetPaymentRecord()], config));
    A.CallTo(() => _fakeFileservice.UploadFile(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public void CreatePaymentInstructionsExport_InCorrectBicConfig_ThrowsError()
  {
    //Arrange
    ConfigurationAccountConfig config = new("Gemeente Test", "NL36DEUT0174690436", "1146ghsw");

    //Act && Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.CreatePaymentInstructionsExport([GetPaymentRecord()], config));
    A.CallTo(() => _fakeFileservice.UploadFile(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public void CreatePaymentInstructionsExport_ToLongAccountNameTransaction_ThrowsError()
  {
    //Arrange
    PaymentRecord record = GetPaymentRecord(name: "Appie HHH.HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh");

    //Act && Assert
    Assert.ThrowsAsync<HHBInvalidInputException>(async () => await _sut.CreatePaymentInstructionsExport([record], defaultConfig));
    A.CallTo(() => _fakeFileservice.UploadFile(A<HhbFile>.Ignored)).MustNotHaveHappened();
  }

  [Test]
  public async Task CreatePaymentInstructionsExport_CorrectFileAttributes()
  {
    //Arrange
    DateTime today = _realDateTimeProvider.UnixToDateTime(UNIXTODAY);
    string formattedDate = today.ToString("yyyy-MM-dd_HH-mm-ss");
    string expectedFileName = "Huishoudboekje-" + formattedDate + "-SEPA-EXPORT.xml";

    //Act
    IHhbFile file = await _sut.CreatePaymentInstructionsExport([GetPaymentRecord()], defaultConfig);

    //Assert
    Assert.That(file.LastModified, Is.EqualTo(UNIXTODAY));
    Assert.That(file.Type, Is.EqualTo(FileType.PaymentInstruction));
    Assert.That(file.Name, Is.EqualTo(expectedFileName));
  }

  [Test]
  public async Task CreatePaymentInstructionsExport_CorrectControlSumAttributes()
  {
    //Arrange
    IList<string> expectedControlSumsPayInfos = ["123.45", "67.89", "95467.35"];
    const string expectedTotalControlSum = "95658.69";
    PaymentRecord record1 = GetPaymentRecord(amount: 12345);
    PaymentRecord record2 = GetPaymentRecord(amount: 6789);
    PaymentRecord record3 = GetPaymentRecord(amount: 9546735);
    //Act
    IHhbFile file = await _sut.CreatePaymentInstructionsExport([record1, record2, record3], defaultConfig);

    //Assert
    string xmlString = Encoding.UTF8.GetString(file.Bytes);
    XDocument xDoc = XDocument.Parse(xmlString);
    XNamespace ns = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";
    AssertCorrectTotalControlSum(xDoc, ns, expectedTotalControlSum);
    AssertCorrectPaymentInformationControlSums(xDoc, ns, expectedControlSumsPayInfos);
  }

  [Test]
  public async Task CreatePaymentInstructionsExport_CorrectAttributesPaymentInstruction()
  {
    //Arrange
    const string defaultRecordAmountAsDecimalString = "725.23";
    const string currencyAttribute = "EUR";
    IList<string> names = ["TESTA", "TESTB", "TESTC"];
    PaymentRecord record1 = GetPaymentRecord(name: "TESTA");
    PaymentRecord record2 = GetPaymentRecord(name: "TESTB");
    PaymentRecord record3 = GetPaymentRecord(name: "TESTC");

    //Act
    IHhbFile file = await _sut.CreatePaymentInstructionsExport([record1, record2, record3], defaultConfig);

    //Assert
    string xmlString = Encoding.UTF8.GetString(file.Bytes);
    XDocument xDoc = XDocument.Parse(xmlString);
    XNamespace ns = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";

    IEnumerable<XElement> pmtInfElements = xDoc.Descendants(ns + "CstmrCdtTrfInitn")
      .Elements(ns + "PmtInf");

    foreach (var element in pmtInfElements)
    {
      XElement? date = element.Element(ns + "ReqdExctnDt");
      Assert.That(date.Value, Is.EqualTo(STRINGPROCESSIGNDATE));

      XElement? senderName = element.Element(ns + "Dbtr").Element(ns + "Nm");
      Assert.That(senderName.Value, Is.EqualTo(defaultConfig.Name));

      XElement? senderIban = element.Element(ns + "DbtrAcct").Element(ns + "Id").Element(ns + "IBAN");
      Assert.That(senderIban.Value, Is.EqualTo(defaultConfig.Iban));

      XElement? senderBic = element.Element(ns + "DbtrAgt").Element(ns + "FinInstnId").Element(ns + "BIC");
      Assert.That(senderBic.Value, Is.EqualTo(defaultConfig.Bic));

      XElement? chargeBearer = element.Element(ns + "ChrgBr");
      Assert.That(chargeBearer.Value, Is.EqualTo("SLEV"));

      XElement? transactionElement = element.Element(ns + "CdtTrfTxInf");
      XElement? transactionAmount = transactionElement.Element(ns + "Amt").Element(ns + "InstdAmt");
      Assert.That(transactionAmount.Value, Is.EqualTo(defaultRecordAmountAsDecimalString));
      Assert.That(transactionAmount.Attribute("Ccy").Value, Is.EqualTo(currencyAttribute));

      XElement? transactionReceiverName = transactionElement.Element(ns + "Cdtr").Element(ns + "Nm");
      Assert.That(names.Contains(transactionReceiverName.Value), Is.True);

      XElement? transactionReceiverIban = transactionElement.Element(ns + "CdtrAcct").Element(ns + "Id").Element(ns + "IBAN");
      Assert.That(transactionReceiverIban.Value, Is.EqualTo(record1.AccountIban));

      XElement? transactionDescription = transactionElement.Element(ns + "RmtInf").Element(ns + "Ustrd");
      Assert.That(transactionDescription.Value, Is.EqualTo(record1.Description));
    }
  }

  [Test]
  public async Task CreatePaymentInstructionsExport_CorrectAbsoluteAmountOnNegativeIntPaymentInstruction()
  {
    //Arrange
    const string defaultRecordAmountAsDecimalString = "725.23";
    PaymentRecord record1 = GetPaymentRecord(amount: -72523);

    //Act
    IHhbFile file = await _sut.CreatePaymentInstructionsExport([record1], defaultConfig);

    //Assert
    string xmlString = Encoding.UTF8.GetString(file.Bytes);
    XDocument xDoc = XDocument.Parse(xmlString);
    XNamespace ns = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";

    IEnumerable<XElement> pmtInfElements = xDoc.Descendants(ns + "CstmrCdtTrfInitn")
      .Elements(ns + "PmtInf");

    foreach (var element in pmtInfElements)
    {
      XElement? transactionElement = element.Element(ns + "CdtTrfTxInf");
      XElement? transactionAmount = transactionElement.Element(ns + "Amt").Element(ns + "InstdAmt");
      Assert.That(transactionAmount.Value, Is.EqualTo(defaultRecordAmountAsDecimalString));
    }
  }


  private static void AssertCorrectPaymentInformationControlSums(XDocument xDoc, XNamespace ns, IList<string> controlSumsPayInfos)
  {
    IEnumerable<XElement> pmtInfElements = xDoc.Descendants(ns + "CstmrCdtTrfInitn")
      .Elements(ns + "PmtInf");

    Assert.That(pmtInfElements.Count(), Is.EqualTo(controlSumsPayInfos.Count()));

    foreach (var element in pmtInfElements)
    {
      XElement? sum = element.Element(ns + "CtrlSum");
      Assert.That(controlSumsPayInfos.Contains(sum.Value), Is.True);
    }
  }

  private static void AssertCorrectTotalControlSum(XDocument xDoc, XNamespace ns,string expected)
  {
    XElement? ctrlSumElement = xDoc.Descendants(ns + "GrpHdr")
      .Elements(ns + "CtrlSum")
      .FirstOrDefault();

    Assert.That(ctrlSumElement, Is.Not.Null);
    Assert.That(ctrlSumElement?.Value, Is.EqualTo(expected));
  }

  private static PaymentRecord GetPaymentRecord(int amount = 72523, long processingDate = UNIXPROCESSINGDATE, string description = "loon vanuit huidhoudboekie", string iban = "NL36DEUT0174690436", string name = "Appie H")
  {
    PaymentRecord record = new()
    {
      Amount = amount,
      ProcessingDate = processingDate,
      Description = description,
      AccountIban = iban,
      AccountName = name
    };
    return record;
  }
}
