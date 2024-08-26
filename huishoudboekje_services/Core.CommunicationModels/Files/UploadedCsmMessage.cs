using Core.CommunicationModels.Files.Interfaces;

namespace Core.CommunicationModels.Files;

public class UploadedCsmMessage
{
  public IHhbFile UploadedFile { get; set; }
}
