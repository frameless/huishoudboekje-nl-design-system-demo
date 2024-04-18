using Core.CommunicationModels.Citizen.Interfaces;

namespace Core.CommunicationModels.Citizen;

public class MinimalCitizenData : IMinimalCitizenData
{
  public int Bsn { get; set; }
  public string FirstNames { get; set; }
  public string LastName { get; set; }
}
