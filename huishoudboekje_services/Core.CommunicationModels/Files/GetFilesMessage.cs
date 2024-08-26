namespace Core.CommunicationModels.Files;

public class GetFilesMessage
{
  public IList<string> uuids { get; set; }
}
