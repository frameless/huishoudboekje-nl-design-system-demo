using System.Text.Json;
using AlarmService.Domain.Contexts;
using AlarmService.Domain.Mappers.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.LogModels.Interfaces;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Domain.Mappers;

public class SignalMapper : ISignalMapper
{
  public Signal GetDatabaseObject(ISignalModel communicationModel)
  {
    Signal signal = new Signal
    {
      Type = communicationModel.Type,
      IsActive = communicationModel.IsActive,
      OffByAmount = communicationModel.OffByAmount,
      CreatedAt = communicationModel.CreatedAt,
    };
    if (communicationModel.AlarmUuid != null && !communicationModel.AlarmUuid.Equals(""))
    {
      signal.AlarmUuid = Guid.Parse(communicationModel.AlarmUuid);
    }
    if (communicationModel.CitizenUuid != null && !communicationModel.CitizenUuid.Equals(""))
    {
      signal.CitizenUuid = Guid.Parse(communicationModel.CitizenUuid);
    }
    if (communicationModel.AgreementUuid != null && !communicationModel.AgreementUuid.Equals(""))
    {
      signal.AgreementUuid = Guid.Parse(communicationModel.AgreementUuid);
    }
    if (communicationModel.UpdatedAt != null)
    {
      signal.UpdatedAt = communicationModel.UpdatedAt;
    }
    if (communicationModel.JournalEntryUuids != null)
    {
      signal.JournalEntryUuids = JsonSerializer.Serialize(communicationModel.JournalEntryUuids);
    }

    if (communicationModel.UUID != null!)
    {
      signal.Uuid = Guid.Parse(communicationModel.UUID);
    }
    return signal;
  }

  public IList<Signal> GetDatabaseObjects(IList<ISignalModel> communicationModels)
  {
    return communicationModels.Select(GetDatabaseObject).ToList();
  }

  public ISignalModel GetCommunicationModel(Signal databaseObject)
  {
    SignalModel model = new()
    {
      UUID = databaseObject.Uuid.ToString(),
      Type = databaseObject.Type,
      IsActive = databaseObject.IsActive,
      OffByAmount = databaseObject.OffByAmount,
      UpdatedAt = databaseObject.UpdatedAt,
      CreatedAt = databaseObject.CreatedAt,
      AlarmUuid = databaseObject.AlarmUuid.ToString(),
      CitizenUuid = databaseObject.CitizenUuid.ToString(),
      AgreementUuid = databaseObject.AgreementUuid.ToString()
    };
    if (databaseObject.JournalEntryUuids != null)
    {
      model.JournalEntryUuids = JsonSerializer.Deserialize<List<string>>(databaseObject.JournalEntryUuids);
    }

    return model;
  }

  public IList<ISignalModel> GetCommunicationModels(IList<Signal> databaseObjects)
  {
    return databaseObjects.Select(GetCommunicationModel).ToList();
  }

  public Paged<ISignalModel> GetPagedCommunicationModels(Paged<Signal> paged)
  {
    return new Paged<ISignalModel>(
      paged.Data.Select(GetCommunicationModel).ToList(),
      paged.TotalCount);
  }
}
