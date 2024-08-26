using System.Text;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using Core.ErrorHandling.Exceptions;

namespace FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03;

public class Pain_001_001_03_Generator
{
  private XNamespace xmlns = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.03";
  private XNamespace xsi = "http://www.w3.org/2001/XMLSchema-instance";
  private List<XElement> paymentInformationList;
  private IList<XElement> defaultSenderElements;

  public Pain_001_001_03_Generator(Sender defaultSender)
  {
    paymentInformationList = [];
    defaultSenderElements = SenderElements(defaultSender);
  }

  public void AddPaymentInformation(PaymentInformation paymentInformation)
  {
    string pmtInfId = $"PmtInfId-{paymentInformationList.Count + 1}";
    XElement paymentInformationElement = new XElement(
      xmlns + "PmtInf",
      new XElement(xmlns + "PmtInfId", pmtInfId),
      new XElement(xmlns + "PmtMtd", paymentInformation.PaymentMethod),
      new XElement(xmlns + "BtchBookg", paymentInformation.Batch.ToString().ToLower()),
      new XElement(xmlns + "NbOfTxs", paymentInformation.Transactions.Count),
      new XElement(xmlns + "CtrlSum", paymentInformation.TransactionsControlSum),
      new XElement(
        xmlns + "PmtTpInf",
        new XElement(
          xmlns + "SvcLvl",
          new XElement(xmlns + "Cd", "SEPA"))),
      new XElement(xmlns + "ReqdExctnDt", paymentInformation.ExecutionDate.ToString("yyyy-MM-dd")),
      SenderElements(paymentInformation.Sender),
      new XElement(xmlns + "ChrgBr", paymentInformation.ChargeBearer),
      TransactionInformationElements(paymentInformation.Transactions));

    paymentInformationList.Add(paymentInformationElement);
  }

  private IList<XElement> TransactionInformationElements(IList<TransactionInformation> transactionInformationList)
  {
    IList<XElement> elements = [];
    foreach (TransactionInformation transaction in transactionInformationList)
    {
      elements.Add(new XElement(xmlns + "CdtTrfTxInf",
        new XElement(
          xmlns + "PmtId",
          new XElement(xmlns + "EndToEndId", transaction.EndToEndId)),
        new XElement(
          xmlns + "Amt",
          new XElement(xmlns + "InstdAmt", new XAttribute("Ccy", transaction.Currency), transaction.Amount)),
        new XElement(
          xmlns + "Cdtr",
          new XElement(xmlns + "Nm", transaction.Receiver.Name)),
        new XElement(
          xmlns + "CdtrAcct",
          new XElement(
            xmlns + "Id",
            new XElement(xmlns + "IBAN", transaction.Receiver.Iban))),
        new XElement(
          xmlns + "RmtInf",
          new XElement(xmlns + "Ustrd", transaction.Description))));
    }
    return elements;
  }

  private IList<XElement> SenderElements(Sender? sender)
  {
    if (sender == null)
    {
      return defaultSenderElements;
    }
    return
    [
      new XElement(xmlns + "Dbtr", new XElement(xmlns + "Nm", sender.Name)),
      new XElement(xmlns + "DbtrAcct", new XElement(xmlns + "Id", new XElement(xmlns + "IBAN", sender.Iban))),
      new XElement(xmlns + "DbtrAgt", new XElement(xmlns + "FinInstnId", new XElement(xmlns + "BIC", sender.Bic)))
    ];
  }

  public string Generate(string name, decimal controlSum)
  {
    XDocument document = new(
      new XDeclaration("1.0", "UTF-8", null),
      new XElement(
        xmlns + "Document",
        new XAttribute(XNamespace.Xmlns + "xsi", xsi),
        new XElement(
          xmlns + "CstmrCdtTrfInitn",
          new XElement(
            xmlns + "GrpHdr",
            new XElement(xmlns + "MsgId", Guid.NewGuid().ToString("N")),
            new XElement(xmlns + "CreDtTm", DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")),
            new XElement(xmlns + "NbOfTxs", paymentInformationList.Count),
            new XElement(xmlns + "CtrlSum", controlSum),
            new XElement(xmlns + "InitgPty",
              new XElement(xmlns + "Nm", name))),
          paymentInformationList)));

    ValidateSchema(document);
    return GetXmlString(document);
  }

  private string GetXmlString(XDocument document)
  {
    string xmlString;
    using MemoryStream memoryStream = new MemoryStream();
    XmlWriterSettings settings = new XmlWriterSettings
    {
      Indent = true,
      Encoding = Encoding.UTF8,
      OmitXmlDeclaration = false
    };
    using (XmlWriter xmlWriter = XmlWriter.Create(memoryStream, settings))
    {
      document.Save(xmlWriter);
    }

    memoryStream.Position = 0;
    using (StreamReader reader = new StreamReader(memoryStream, Encoding.UTF8))
    {
      xmlString = reader.ReadToEnd();
    }

    return xmlString;
  }

  private void ValidateSchema(XDocument document)
  {
    XmlSchemaSet schemas = new();
    string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "FileGenerators", "PaymentInstructionsExport", "pain.001.001.03", "pain.001.001.03.xsd");
    schemas.Add(null, path);
    document.Validate(schemas, ValidationEventHandler);
  }

  private static void ValidationEventHandler(object? sender, ValidationEventArgs e)
  {
    // Not logging the e.Message since it may contain sensitive data
    throw new HHBInvalidInputException("could not generate SEPA pain 001 001 03 file", "Error while generating payment instructions export file");
  }
}
