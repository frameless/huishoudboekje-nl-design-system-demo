using Core.CommunicationModels.Files.Interfaces;

namespace FileServices.Logic.Producers;

public interface INotifyProducer
{
  public Task NotifyFileUpload(IHhbFile uploadedFile);
}
