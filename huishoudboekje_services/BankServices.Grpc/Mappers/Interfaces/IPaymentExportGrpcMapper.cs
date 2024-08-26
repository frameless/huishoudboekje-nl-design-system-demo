using BankService_RPC;
using Core.CommunicationModels.PaymentModels.Interfaces;

namespace BankServices.Grpc.Mappers.Interfaces;

public interface IPaymentExportGrpcMapper
{
  public IList<PaymentExportData> GetGrpcObjects(IList<IPaymentExport> exports);
  public PaymentExportData GetGrpcObject(IPaymentExport export, bool mapRecords = false);
}
