using BankService_RPC;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Grpc.Mappers.Interfaces;

public interface ICsmGrpcMapper
{
  public IHhbFile GetCommunicationModel(FileUpload upload);

  public IList<CsmData> GetGrpcObjects(IList<ICsm> files);
}
