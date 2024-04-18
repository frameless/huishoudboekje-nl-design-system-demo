namespace UserApi.Producers.Interfaces;

public interface ICheckBsnProducer
{
  public Task<bool> RequestCheckBsn(string bsn);
}
