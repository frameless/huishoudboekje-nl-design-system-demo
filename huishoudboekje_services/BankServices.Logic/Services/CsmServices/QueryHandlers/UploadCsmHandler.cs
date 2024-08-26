using System.Text;
using System.Text.RegularExpressions;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels.Files.Interfaces;
using Core.ErrorHandling.Exceptions;

namespace BankServices.Logic.Services.CsmServices.QueryHandlers;

internal partial class UploadCsmHandler(IFileProducer producer) : IQueryHandler<UploadCsm, IHhbFile>
{
  private const int TwoMegabytes = 2000000;
  //Regex pattern to check camt version in namespace (xmlns)
  private const string NameSpaceRegexPattern = "xmlns=\"(urn:iso:std:iso:20022:tech:xsd:camt.054.|urn:iso:std:iso:20022:tech:xsd:camt.053.|urn:iso:std:iso:20022:tech:xsd:camt.052.|urn:iso:std:iso:20022:tech:xsd:camt.052.)";

  public Task<IHhbFile> HandleAsync(UploadCsm query)
  {
    IsValidCsmFile(query.FileUpload);
    return producer.Upload(query.FileUpload);
  }

  private void IsValidCsmFile(IHhbFile hhbFile)
  {
    if (!IsXmlFile(hhbFile.Name))
    {
      throw new HHBInvalidInputException("File extension not supported", "The provided file is not an xml file");
    }
    if (!IsCorrectSize(hhbFile.Size))
    {
      throw new HHBInvalidInputException("File to big", "The provided file is to big");
    }
    if (!IsValidXmlNamespace(hhbFile.Bytes))
    {
      throw new HHBInvalidInputException("File version is not supported", "The provided CAMT version is not supported");
    }
  }
  private bool IsXmlFile(string fileName)
  {
    string extension = Path.GetExtension(fileName);
    return extension.Equals(".xml", StringComparison.OrdinalIgnoreCase);
  }

  private bool IsCorrectSize(int size)
  {
    return size <= TwoMegabytes;
  }

  private bool IsValidXmlNamespace(byte[] xmlBytes)
  {
    string xmlString = Encoding.UTF8.GetString(xmlBytes);
    return NameSpaceRegex().IsMatch(xmlString);
  }

  [GeneratedRegex(NameSpaceRegexPattern)]
  private static partial Regex NameSpaceRegex();
}
