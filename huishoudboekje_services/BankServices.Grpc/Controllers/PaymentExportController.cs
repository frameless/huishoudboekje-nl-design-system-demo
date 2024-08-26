using System.Text;
using BankService_RPC;
using BankServices.Grpc.Mappers.Interfaces;
using BankServices.Logic.Services.PaymentExportServices.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.Files.Interfaces;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Grpc.Core;

namespace BankServices.Grpc.Controllers;

public class PaymentExportController(IPaymentExportService paymentExportService, IPaymentExportGrpcMapper mapper) : PaymentExport.PaymentExportBase
{
  public override async Task<CreatePaymentExportResponse> Create(CreatePaymentExportRequest request, ServerCallContext context)
  {
    return new CreatePaymentExportResponse()
    {
      Success = true,
      Id = await paymentExportService.CreateExport(request.RecordIds, request.StartDate, request.EndDate)
    };
  }

  public override async Task<PaymentExportsPagedResponse> GetPaged(PaymentExportsPagedRequest request, ServerCallContext context)
  {
    Pagination page = new(request.Page.Take, request.Page.Skip);
    Paged<IPaymentExport> pagedFiles = await paymentExportService.GetPaged(page);
    PaymentExportsPagedResponse response = new();
    response.Data.AddRange(mapper.GetGrpcObjects(pagedFiles.Data));
    response.PageInfo = new PaymentExportPaginationResponse()
    {
      Skip = page.Skip,
      Take = page.Take,
      TotalCount = pagedFiles.TotalCount
    };
    return response;
  }

  public override async Task<DownloadPaymentExportResponse> GetFile(DownloadPaymentExportRequest request, ServerCallContext context)
  {
    IHhbFile file = await paymentExportService.GetFile(request.Id);
    return new()
    {
      Id = request.Id,
      Name = file.Name,
      FileString = Encoding.UTF8.GetString(file.Bytes)
    };
  }

  public override async Task<PaymentExportData> Get(GetPaymentExportRequest request, ServerCallContext context)
  {
    return mapper.GetGrpcObject(await paymentExportService.Get(request.Id), mapRecords: true);
  }
}
