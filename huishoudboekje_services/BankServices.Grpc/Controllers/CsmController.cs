using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using BankServices.Logic.Services.CsmServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;
using Grpc.Core;

namespace BankServices.Grpc.Controllers;

public class CsmController(ICsmService service, ICsmGrpcMapper grpcMapper) : CSM.CSMBase
{
  public override async Task<FileUploadResponse> Upload(CSMUploadRequest request, ServerCallContext context)
  {
    IHhbFile uploadedFile = await service.Upload(grpcMapper.GetCommunicationModel(request.File));
    return new FileUploadResponse
    {
      Id = uploadedFile.UUID,
      Name = uploadedFile.Name
    };
  }

  public override async Task<CSMPagedResponse> GetPaged(CSMPagedRequest request, ServerCallContext context)
  {
    Pagination page = new(request.Page.Take, request.Page.Skip);
    Paged<ICsm> pagedFiles = await service.GetPaged(page);
    CSMPagedResponse response = new();
    response.Data.AddRange(grpcMapper.GetGrpcObjects(pagedFiles.Data));
    response.PageInfo = new PaginationResponse()
    {
      Skip = page.Skip,
      Take = page.Take,
      TotalCount = pagedFiles.TotalCount
    };
    return response;
  }

  public override async Task<CSMDeleteResponse> Delete(CSMDeleteRequest request, ServerCallContext context)
  {
    return new CSMDeleteResponse()
    {
      Deleted = await service.Delete(request.Id),
      Id = request.Id
    };
  }
}
