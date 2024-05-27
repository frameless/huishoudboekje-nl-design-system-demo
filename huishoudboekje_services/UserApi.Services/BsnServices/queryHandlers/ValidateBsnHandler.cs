using Core.ErrorHandling.Exceptions;
using UserApi.Services.BsnServices.Queries;
using UserApi.Services.Interfaces;

namespace UserApi.Services.BsnServices.queryHandlers;

internal class ValidateBsnHandler : IQueryHandler<ValidateBsn, bool>
{
  public Task<bool> HandleAsync(ValidateBsn query)
  {
    return Task.FromResult(CheckIsAllDigits(query.Bsn) && CheckBsnLength(query.Bsn) && CheckElevenTest(query.Bsn));
  }

  private bool CheckIsAllDigits(string bsn)
  {
    return bsn.All(char.IsDigit);
  }

  private bool CheckBsnLength(string bsn)
  {
    return bsn.Length is (8 or 9);
  }

  private bool CheckElevenTest(string bsn)
  {
    IList<int> digitsList = bsn.Select(CharToInt).ToList();
    int total = CalculateAdditions(digitsList.SkipLast(1).ToList(), bsn.Length) - digitsList.Last();
    return total % 11 == 0;
  }

  private int CalculateAdditions(List<int> digits, int length)
  {
    int sum = 0;
    int multiplier = length;
    digits.ForEach(
      digit =>
      {
        sum += digit * multiplier;
        multiplier--;
      });
    return sum;
  }

  private int CharToInt(char digit)
  {
    if (char.IsDigit(digit))
    {
      return digit - '0';
    }
    throw new HHBDataException(
      "Can't convert char to int",
      "Incorrect input");
  }
}
