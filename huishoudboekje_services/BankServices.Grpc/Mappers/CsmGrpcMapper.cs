using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Google.Protobuf;

namespace BankServices.Grpc.Mappers;

public class CsmGrpcMapper : ICsmGrpcMapper
{
  public IHhbFile GetCommunicationModel(FileUpload upload)
  {
    HhbFile file = new()
    {
      Type = FileType.CustomerStatementMessage,
      Name = upload.Name,
      LastModified = upload.LastModified,
      Bytes = GetBytes(upload.BlobParts)
    };
    file.Size = file.Bytes.Length;
    return file;
  }

  public IList<CsmData> GetGrpcObjects(IList<ICsm> csms)
  {
    return csms.Select(GetGrpcObject).ToList();
  }

  private CsmData GetGrpcObject(ICsm csm)
  {
    return new CsmData()
    {
      Id = csm.UUID,

      File = csm.File != null ? new FileData
      {
        Id = csm.File.UUID,
        Name = csm.File.Name,
        UploadedAt = csm.File.UploadedAt
      } : null,
      TransactionCount = csm.Transactions.Count
    };
  }

  private byte[] GetBytes(IEnumerable<ByteString> blobParts)
  {
    return blobParts.Select(blob => blob.ToByteArray()).SelectMany(array => array).ToArray();
  }
}
