using Core.CommunicationModels.SignalModel.Interfaces;
using Core.utils.InputValidation;

namespace AlarmService.Logic.InputValidators;

public class SignalValidator(string modelDisplayName = "signal") : BaseInputValidator<ISignalModel>(modelDisplayName)
{
  private int[] allowedTypes = [1, 2];
  protected override bool CheckModel(ISignalModel input)
  {
    return CheckHasAllowedType(input) &&
           CheckHasValidCreationDate(input);
  }

  private bool CheckHasAllowedType(ISignalModel input)
  {
    return allowedTypes.Contains(input.Type);
  }

  private bool CheckHasValidCreationDate(ISignalModel input)
  {
    return CheckValidTimestamp(input.CreatedAt);
  }
}
