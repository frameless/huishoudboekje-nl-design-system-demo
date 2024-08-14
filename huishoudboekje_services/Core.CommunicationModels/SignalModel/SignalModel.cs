using Core.CommunicationModels.SignalModel.Interfaces;

namespace Core.CommunicationModels.SignalModel;

public class SignalModel : ISignalModel
{
  public string UUID { get; set; }

  public int Type { get; set; }

  public bool IsActive { get; set; }

  public int OffByAmount { get; set; }

  public long? UpdatedAt { get; set; }

  public long CreatedAt { get; set; }

  public IList<string>? JournalEntryUuids { get; set; }

  public string? AlarmUuid { get; set; }

  public string CitizenUuid { get; set; }

  public string AgreementUuid { get; set; }
}
