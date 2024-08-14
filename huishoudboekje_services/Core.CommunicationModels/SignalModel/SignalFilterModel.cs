using Core.CommunicationModels.SignalModel.Interfaces;

namespace Core.CommunicationModels.SignalModel;

public class SignalFilterModel : ISignalFilterModel
{
    public IList<string>? AlarmIds { get; set; }
    public IList<string>? Ids { get; set; }
    public IList<string>? CitizenIds { get; set; }
    public IList<string>? AgreementIds { get; set; }
    public IList<string>? JournalEntryIds { get; set; }
    public bool? IsActive { get; set; }
    public IList<int>? Types { get; set; }
}
