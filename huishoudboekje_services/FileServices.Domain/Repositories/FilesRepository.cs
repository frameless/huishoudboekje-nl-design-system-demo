using Core.CommunicationModels.Files.Interfaces;
using Core.Database.DatabaseCommands;
using Core.Database.Repositories;
using FileServices.Domain.Contexts;
using FileServices.Domain.Mappers;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using File = FileServices.Domain.Contexts.Models.File;
using Models_File = FileServices.Domain.Contexts.Models.File;

namespace FileServices.Domain.Repositories;

public class FilesRepository(FileServiceContext dbContext) : BaseRepository<Models_File>(dbContext), IFilesRepository
{
  private readonly IFileMapper mapper = new FileMapper();
  public async Task<bool> FileExists(string sha256)
  {
    List<File> result = await ExecuteCommand(
          new WhereCommandDecorator<File>(new GetAllCommand<File>(), file => file.Sha256.Equals(sha256)));
    return result.Count > 0;
  }

  public async Task<IHhbFile> Insert(IHhbFile hhbFile)
  {
    EntityEntry<File> insertedFile =
        await ExecuteCommand(new InsertRecordCommand<File>(mapper.GetDatabaseObject(hhbFile)));
    await SaveChangesAsync();
    return mapper.GetCommunicationModel(insertedFile.Entity);
  }

  public async Task Delete(string uuid)
  {
    dbContext.Remove(await ExecuteCommand(new GetByIdCommand<File>(Guid.Parse(uuid))));
    await SaveChangesAsync();
  }

  public async Task<IList<IHhbFile>> GetMultipleById(IList<string> uuids)
  {
    return mapper.GetCommunicationModels(
      await ExecuteCommand(
        new NoTrackingCommandDecorator<File>(
          new GetMultipleByIdCommand<File>(file => uuids.Contains(file.Uuid.ToString())))));
  }
}
