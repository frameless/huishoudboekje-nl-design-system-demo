using Core.CommunicationModels.Files.Interfaces;

namespace Core.CommunicationModels.Files;

public class HhbFile : IHhbFile
{
  public string UUID { get; set; }
  public FileType Type { get; set; }
  public string Sha256 { get; set; }
  public string Name { get; set; }
  public long LastModified { get; set; }
  public long UploadedAt { get; set; }
  public int Size { get; set; }
  public byte[] Bytes { get; set; }
}
