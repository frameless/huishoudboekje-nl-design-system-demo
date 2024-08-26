using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using FileServices.Logic.Producers;
using MassTransit;

namespace FileServices.MessageQueue.Producers;

public class NotifyProducer(IPublishEndpoint publishEndpoint) : INotifyProducer
{
  public Task NotifyFileUpload(IHhbFile uploadedFile)
  {
    switch (uploadedFile.Type)
    {
      case FileType.CustomerStatementMessage:
      {
        UploadedCsmMessage message = new()
        {
          UploadedFile = uploadedFile
        };
        return publishEndpoint.Publish(message);
      }
      case FileType.PaymentInstruction:
        //Is returned directly so no need to notify
        return Task.CompletedTask;
      default:
        throw new NotImplementedException();
    }
  }
}
