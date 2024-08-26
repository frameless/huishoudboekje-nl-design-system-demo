namespace Core.CommunicationModels.Files;

public class GetFilesPaged
{
  public Pagination pagination { get; set; }
  public FileType type { get; set; }
}
