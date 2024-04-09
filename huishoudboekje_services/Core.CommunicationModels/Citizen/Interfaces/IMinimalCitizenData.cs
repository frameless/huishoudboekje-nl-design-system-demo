namespace Core.CommunicationModels.Citizen.Interfaces;

public interface IMinimalCitizenData
{
  public int Bsn { get; }
  public string FirstNames { get; }
  public string LastName { get; }
}
