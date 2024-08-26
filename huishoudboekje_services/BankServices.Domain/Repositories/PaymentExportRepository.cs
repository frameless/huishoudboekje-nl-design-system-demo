using BankServices.Domain.Contexts;
using BankServices.Domain.Contexts.Models;
using BankServices.Domain.Mappers.Interfaces;
using BankServices.Domain.Repositories.Interfaces;
using Core.CommunicationModels;
using Core.CommunicationModels.PaymentModels.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using Core.Database.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BankServices.Domain.Repositories;

public class PaymentExportRepository(BankServiceContext context, IPaymentExportDbMapper mapper) : BaseRepository<PaymentExport>(context), IPaymentExportRepository
{
  public async Task<IPaymentExport> Add(IPaymentExport data)
  {
    EntityEntry<PaymentExport> inserted = await ExecuteCommand(new InsertRecordCommand<PaymentExport>(mapper.GetDatabaseObject(data)));
    await SaveChangesAsync();
    return mapper.GetCommunicationModel(inserted.Entity);
  }

  public async Task<Paged<IPaymentExport>> GetPaged(Pagination queryPagination)
  {
    PagedCommandDecorator<PaymentExport> command = new(
        new IncludeCommandDecorator<PaymentExport>(
          new OrderByCommandDecorator<PaymentExport>(
            new GetAllCommand<PaymentExport>(),
            export => export.CreatedAt,
            desc: true),
          export => export.Records),
        queryPagination);
    Paged<PaymentExport> result = await ExecuteCommand(command);
    return new Paged<IPaymentExport>(
      mapper.GetCommunicationModels(result.Data).ToList(),
      result.TotalCount);
  }

  public async Task<IPaymentExport> GetById(string queryPaymentExportId, bool includeRecords = false)
  {
    IDatabaseDecoratableCommand<PaymentExport> command =
      new WhereCommandDecorator<PaymentExport>(
        new GetAllCommand<PaymentExport>(),
        export => export.Uuid.Equals(Guid.Parse(queryPaymentExportId)));

    if (includeRecords)
    {
      command = new IncludeCommandDecorator<PaymentExport>(command, export => export.Records);
    }
    List<PaymentExport> result = await ExecuteCommand(command);
    //TODO needs fix for not found
    return mapper.GetCommunicationModel(result.First());
  }
}
