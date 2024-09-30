using System.Globalization;
using System.Xml;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.TransactionModels;
using Core.CommunicationModels.TransactionModels.Interfaces;
using Core.ErrorHandling.Exceptions;
using Core.utils.DateTimeProvider;

namespace BankServices.Logic.Parsers;

public class CamtFileParser(IDateTimeProvider dateTimeProvider, ICsmService csmService, IConfigurationProducer configurationProducer) : ICsmFileParser
{
  private static readonly NumberFormatInfo NumberFormatInfo = new()
  {
    CurrencyGroupSeparator = "."
  };

  public async Task<ICsm> Parse(IHhbFile file)
  {
    XmlDocument document = GetXmlDocumentFromByteArray(file.Bytes);
    XmlNamespaceManager namespaceManager = SetupXmlNamespaceManager(document);
    XmlNode? root = document.DocumentElement;
    return new Csm()
    {
      File = file,
      AccountIdentification = await ParseAccountIdentification(root, namespaceManager),
      TransactionReference = await ParseTransactionReference(root, namespaceManager),
      UploadedAt = file.UploadedAt,
      Transactions = ParseTransactions(root, namespaceManager),
    };
  }

  private IList<ITransactionModel> ParseTransactions(XmlNode? root, XmlNamespaceManager namespaceManager)
  {
    IList<ITransactionModel> transactions = new List<ITransactionModel>();
    XmlNodeList? transactionNodes = GetTransactionNodes(root, namespaceManager);
    foreach (XmlNode? transaction in transactionNodes)
    {
      transactions.Add(
        new TransactionModel()
      {
        Amount = ParseTransactionAmount(namespaceManager, transaction),
        IsCredit = ParseIsCredit(namespaceManager, transaction),
        FromAccount = ParseFromAccount(namespaceManager, transaction),
        Date = ParseDate(namespaceManager, transaction),
        InformationToAccountOwner = ParseInformationToAccountOwner(namespaceManager, transaction)
      });
    }

    if (transactions.Count == 0)
    {
      throw new HHBDataException("File contains 0 transactions", "messages.csm.parsing.noTransactions");
    }
    return transactions;
  }

  private string ParseInformationToAccountOwner(XmlNamespaceManager namespaceManager, XmlNode transaction)
  {
    IList<string?> informationToAccountOwnerList =
    [
      transaction.SelectSingleNode("./ns:AddtlNtryInf", namespaceManager)?.InnerText,
      transaction.SelectSingleNode("./ns:NtryDtls/ns:TxDtls/ns:RmtInf/ns:Ustrd", namespaceManager)?.InnerText,
      transaction.SelectSingleNode("./ns:NtryDtls/ns:TxDtls/ns:Refs/ns:EndToEndId", namespaceManager)?.InnerText,
      transaction.SelectSingleNode("./ns:NtryDtls/ns:TxDtls/ns:Refs/ns:MndtId", namespaceManager)?.InnerText,
    ];
    return RemoveDuplicatesAndCombineAsString(informationToAccountOwnerList);
  }

  private static string RemoveDuplicatesAndCombineAsString(IList<string?> informationToAccountOwnerList)
  {
    List<string?> listWithoutNulls = informationToAccountOwnerList.Where(s => s != null).ToList();
    if (listWithoutNulls.Count == 0)
    {
      throw new HHBParsingException(
        "Could not parse description for a transaction while parsing camt file",
        "Error in description for a transaction in CAMT file, cannot parse it correctly");
    }
    string concatenatedList = string.Join(" ", listWithoutNulls);
    List<string> listWithoutDuplicates = concatenatedList.Split(' ').Distinct().ToList();
    return string.Join(" ", listWithoutDuplicates);
  }

  private long ParseDate(XmlNamespaceManager namespaceManager, XmlNode transaction)
  {
    XmlNode? dateNode = transaction.SelectSingleNode("./ns:ValDt/ns:Dt", namespaceManager);
    if (dateNode == null)
    {
      throw new HHBParsingException(
        "Could not parse date for a transaction while parsing camt file",
        "Error in date for a transaction in CAMT file, cannot parse it correctly");
    }
    DateTime date = DateTime.Parse(dateNode.InnerText);
    DateTime dateAsUtc = dateTimeProvider.DateAsUtc(date);
    return dateTimeProvider.DateTimeToUnix(dateAsUtc);
  }

  private string? ParseFromAccount(XmlNamespaceManager namespaceManager, XmlNode transaction)
  {
    XmlNode? ibanNode = transaction.SelectSingleNode("./ns:NtryDtls/ns:TxDtls/ns:RltdPties/ns:DbtrAcct/ns:Id/ns:IBAN", namespaceManager) ??
                        transaction?.SelectSingleNode("./ns:NtryDtls/ns:TxDtls/ns:RltdPties/ns:CdtrAcct/ns:Id/ns:IBAN", namespaceManager);
    return ibanNode?.InnerText;
  }

  private static int ParseTransactionAmount(XmlNamespaceManager namespaceManager, XmlNode transaction)
  {
    XmlNode? amountNode = transaction.SelectSingleNode("./ns:Amt[@Ccy='EUR']", namespaceManager);
    if (amountNode == null)
    {
      throw new HHBParsingException(
        "Could not parse amount for a transaction while parsing camt file",
        "Error in amount for a transaction in CAMT file, cannot parse it correctly");
    }
    int amount = (int)(decimal.Parse(amountNode.InnerText, NumberFormatInfo) * 100);
    if (!ParseIsCredit(namespaceManager, transaction))
    {
      amount *= -1;
    }
    return amount;
  }

  private static bool ParseIsCredit(XmlNamespaceManager namespaceManager, XmlNode transaction)
  {
    XmlNode? cdtDbtInd = transaction.SelectSingleNode("./ns:CdtDbtInd", namespaceManager);
    if (cdtDbtInd == null)
    {
      throw new HHBParsingException(
        "Could not parse credit debit indication for a transaction while parsing camt file",
        "Error in amount for a transaction in CAMT file, cannot parse it correctly");
    }
    return "CRDT".Equals(cdtDbtInd.InnerText);
  }

  private async Task<string> ParseTransactionReference(XmlNode? root, XmlNamespaceManager namespaceManager)
  {
    XmlNode? transactionReferenceNode = root?.SelectSingleNode("//ns:Stmt/ns:Id", namespaceManager);
    if (transactionReferenceNode == null)
    {
      throw new HHBParsingException(
        "Could not find transaction reference while parsing camt file",
        "Missing transaction reference in CAMT file, cannot parse it correctly");
    }
    string result = transactionReferenceNode.InnerText;
    await CheckUniqueTransactionReference(result);
    return result;
  }

  private async Task CheckUniqueTransactionReference(string transactionReference)
  {
    if (await csmService.TransactionReferenceExists(transactionReference))
    {
      throw new HHBDataException("Transaction reference is not unique", "messages.csm.parsing.transactionReferenceExists");
    }
  }

  private async Task<string> ParseAccountIdentification(XmlNode? root, XmlNamespaceManager namespaceManager)
  {
    XmlNode? accountIdentificationNode = root?.SelectSingleNode("//ns:Stmt/ns:Acct/ns:Id/ns:IBAN", namespaceManager) ??
                                         root?.SelectSingleNode("//ns:Stmt/ns:Acct/ns:Id/ns:Othr/ns:Id", namespaceManager);
    if (accountIdentificationNode == null)
    {
      throw new HHBParsingException(
        "Could not find account identification while parsing camt file",
        "Missing account identification in CAMT file, cannot parse it correctly");
    }

    string result = accountIdentificationNode.InnerText;
    await CheckValidAccountIdentification(result);
    return result;
  }

  private async Task CheckValidAccountIdentification(string accountIdentification)
  {
    if (!accountIdentification.Equals(await configurationProducer.GetAccountIban()))
    {
      throw new HHBDataException("Account iban not matching configuration iban", "messages.csm.parsing.incorrectAccountIban");
    }
  }

  private static XmlNodeList? GetTransactionNodes(XmlNode? root, XmlNamespaceManager namespaceManager)
  {
    return root?.SelectNodes("//ns:Ntry", namespaceManager);
  }

  private static XmlNamespaceManager SetupXmlNamespaceManager(XmlDocument document)
  {
    string? namespaceUri = document.DocumentElement?.NamespaceURI;
    XmlNamespaceManager xmlnsManager = new(document.NameTable);
    if (namespaceUri != null)
    {
      xmlnsManager.AddNamespace("ns", namespaceUri);
    }
    return xmlnsManager;
  }

  private static XmlDocument GetXmlDocumentFromByteArray(byte[] byteArray)
  {
    XmlDocument xmlDoc = new();
    using MemoryStream stream = new(byteArray);
    xmlDoc.Load(stream);
    return xmlDoc;
  }
}
