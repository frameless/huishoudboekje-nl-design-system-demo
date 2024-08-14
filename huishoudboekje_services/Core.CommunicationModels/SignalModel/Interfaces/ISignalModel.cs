namespace Core.CommunicationModels.SignalModel.Interfaces;

public interface ISignalModel
{
  public string UUID { get; }

  public int Type { get; }

  public bool IsActive { get; set; }

  public int OffByAmount { get; }

  public long? UpdatedAt { get; set; }

  public long CreatedAt { get; }

  public IList<string>? JournalEntryUuids { get; }

  public string? AlarmUuid { get; }

  public string CitizenUuid { get; }
  public string AgreementUuid { get; }
}
