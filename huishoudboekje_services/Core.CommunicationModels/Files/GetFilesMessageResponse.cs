using Core.CommunicationModels.Files.Interfaces;

namespace Core.CommunicationModels.Files;

public class GetFilesMessageResponse
{
  public IList<IHhbFile> Files { get; set; }
}
