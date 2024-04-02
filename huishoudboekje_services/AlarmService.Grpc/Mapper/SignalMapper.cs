using AlarmService_RPC;
using Core.CommunicationModels.SignalModel;
using Core.CommunicationModels.SignalModel.Interfaces;

namespace AlarmService.Grpc.Mapper;

public class SignalMapper : ISignalMapper
{
  public SignalData GetGrpcObject(ISignalModel communicationModel)
  {
    SignalData result = new()
    {
      Id = communicationModel.UUID,
      IsActive = communicationModel.IsActive,
      SignalType = communicationModel.Type,
      OffByAmount = communicationModel.OffByAmount,
      CreatedAt = communicationModel.CreatedAt,
      AlarmId = communicationModel.AlarmUuid,
      CitizenId = communicationModel.CitizenUuid,
      AgreementId = communicationModel.AgreementUuid,
    };
    if (communicationModel.UpdatedAt != null)
    {
      result.UpdatedAt = (long) communicationModel.UpdatedAt;
    }
    if (communicationModel.JournalEntryUuids != null)
    {
      result.JournalEntryIds.AddRange(communicationModel.JournalEntryUuids);
    }
    return result;
  }

  public IList<SignalData> GetGrpcObjects(IList<ISignalModel> communicationModels)
  {
    return communicationModels.Select(GetGrpcObject).ToList();
  }

  public ISignalModel GetCommunicationModel(SignalData signalData)
  {
    SignalModel result = new()
    {
      UUID = signalData.Id,
      IsActive = signalData.IsActive,
      Type = signalData.SignalType,
      OffByAmount = signalData.OffByAmount,
      CreatedAt = signalData.CreatedAt,
      AlarmUuid = signalData.AlarmId,
      CitizenUuid = signalData.CitizenId,
      AgreementUuid = signalData.AgreementId,
      JournalEntryUuids = signalData.JournalEntryIds.ToList()
    };

    if (signalData.HasUpdatedAt)
    {
      result.UpdatedAt = signalData.UpdatedAt;
    }

    return result;
  }

  public SignalFilterModel? GetSignalFilters(SignalFilter? filters)
  {
    if (filters == null)
    {
      return null;
    }

    SignalFilterModel result = new SignalFilterModel
    {
      AgreementIds = filters.AgreementIds.ToList(),
      CitizenIds = filters.CitizenIds.ToList(),
      AlarmIds = filters.AlarmIds
    };
    if (filters.HasIsActive)
    {
      result.IsActive = filters.IsActive;
    }
    return result;
  }
}
