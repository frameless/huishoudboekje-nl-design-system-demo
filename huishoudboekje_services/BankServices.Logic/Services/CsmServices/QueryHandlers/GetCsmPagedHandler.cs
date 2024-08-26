using BankServices.Domain.Repositories;
using BankServices.Domain.Repositories.Interfaces;
using BankServices.Logic.Producers;
using BankServices.Logic.Services.CsmServices.Queries;
using BankServices.Logic.Services.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.CustomerStatementMessage;
using Core.CommunicationModels.Files.Interfaces;

namespace BankServices.Logic.Services.CsmServices.QueryHandlers;

internal class GetCsmPagedHandler(ICsmRepository repository, IFileProducer producer) : IQueryHandler<GetCsmPaged, Paged<ICsm>>
{
  public async Task<Paged<ICsm>> HandleAsync(GetCsmPaged query)
  {
    Paged<ICsm> result = await repository.GetPaged(query.Pagination);
    List<string> fileUuids = result.Data.Select(file => file.File.UUID).ToList();
    IList<IHhbFile> files = await producer.GetFiles(fileUuids);
    MapFilesToCsm(result, files);
    return result;
  }

  private void MapFilesToCsm(Paged<ICsm> result, IList<IHhbFile> files)
  {
    foreach (ICsm csm in result.Data)
    {
      IHhbFile? file = files.FirstOrDefault(file => file.UUID.Equals(csm.File.UUID));
      ((Csm)csm).File = file;
    }
  }
}
