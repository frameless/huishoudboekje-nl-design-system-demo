namespace Core.CommunicationModels.SignalModel.Interfaces;

public interface ISignalFilterModel
{
    public IList<string>? AlarmIds { get; }
    public IList<string>? CitizenIds { get; }
    public IList<string>? AgreementIds { get; }
    public bool? IsActive { get; }
}
