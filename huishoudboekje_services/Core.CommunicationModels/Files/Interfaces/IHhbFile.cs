namespace Core.CommunicationModels.Files.Interfaces;

public interface IHhbFile
{
  public string UUID { get; }
  public string Sha256 { get; }
  public FileType Type { get; }
  public string Name { get; }
  public long LastModified { get; }
  public long UploadedAt { get; }
  public int Size { get; }
  public byte[] Bytes { get; }
}
