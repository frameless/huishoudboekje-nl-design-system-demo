using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Tests.CsmServicesTests;

public static class CsmTools
{
  private static byte[] LoadCamtFile(string filename)
  {
    string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "CsmServicesTests", "CamtTestFiles", filename);
    return File.ReadAllBytes(path);
  }

  public static IHhbFile GenerateHhbFile(string fileName = "test.xml", int size = 5046, string? camtFileName= null)
  {
    camtFileName ??= @"correctCamtType.xml";
    byte[] fileBytes = LoadCamtFile(camtFileName);

    IHhbFile input = new HhbFile()
    {
      Name = fileName,
      Bytes = fileBytes,
      Type = FileType.CustomerStatementMessage,
      LastModified = 1681209176000,
      Size = size
    };
    return input;
  }
}
