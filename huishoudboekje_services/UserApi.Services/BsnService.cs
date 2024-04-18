using Core.ErrorHandling.Exceptions;
using UserApi.Producers.Interfaces;
using UserApi.Services.Interfaces;

namespace UserApi.Services;

public class BsnService(ICheckBsnProducer checkBsnProducer) : IBsnService
{
  public bool Validate(string bsn)
  {
    return CheckIsAllDigits(bsn) && CheckBsnLength(bsn) && CheckElevenTest(bsn);
  }

  public Task<bool> IsAllowed(string bsn)
  {
    return checkBsnProducer.RequestCheckBsn(bsn);
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
