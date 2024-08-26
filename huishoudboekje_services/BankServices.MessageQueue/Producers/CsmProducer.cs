using BankServices.Logic.Producers;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using MassTransit;

namespace BankServices.MessageQueue.Producers;

public class CsmProducer(IRequestClient<IHhbFile> requestClient) : ICsmProducer
{
  public async Task<IHhbFile> Upload(IHhbFile upload)
  {
    Response<IHhbFile> response = await requestClient.GetResponse<IHhbFile>(upload);
    return response.Message;
  }

  public async Task<Paged<ICsm>> GetPaged(Pagination pagination)
  {
    Response<Paged<ICsm>> response = await requestClient.GetResponse<Paged<ICsm>>(
      new GetFilesPaged()
    {
      pagination = pagination,
      type = FileType.CustomerStatementMessage
    });
    return response.Message;
  }
}
