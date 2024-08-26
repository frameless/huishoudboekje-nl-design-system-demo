using Core.CommunicationModels.Files.Interfaces;

namespace Core.CommunicationModels.Files;

public class FileUploadResponse
{
  public IHhbFile? File { get; set; }
  public string? Error { get; set; }
}
