using Core.CommunicationModels.Files;
using Core.CommunicationModels.Files.Interfaces;
using Core.utils.DateTimeProvider;
using FileServices.Logic.FileGenerators.PaymentInstructionsExport;
using FileServices.Logic.Services.Interfaces;
using FileServices.Logic.Services.PaymentInstructionServices.Queries;

namespace FileServices.Logic.Services.PaymentInstructionServices.Handlers;

internal class CreatePaymentInstructionExportHandler(IHhbFileService hhbFileService, IDateTimeProvider dateTimeProvider) : IQueryHandler<CreatePaymentInstructionExport, IHhbFile>
{
  public async Task<IHhbFile> HandleAsync(CreatePaymentInstructionExport command)
  {
    IPaymentInstructionsExportGenerator generator = new SepaGenerator(dateTimeProvider);
    byte[] sepaFileBytes = await generator.Generate(command.Records, command.ConfigurationAccountConfig);
    return await hhbFileService.UploadFile(
      new HhbFile()
      {
        Bytes = sepaFileBytes,
        Type = FileType.PaymentInstruction,
        Name = GenerateFileName(),
        LastModified = dateTimeProvider.UnixNow(),
        Size = sepaFileBytes.Length
      });
  }

  private string GenerateFileName()
  {
    DateTime today = dateTimeProvider.Today();
    string formattedDate = today.ToString("yyyy-MM-dd_HH-mm-ss");
    return "Huishoudboekje-" + formattedDate + "-SEPA-EXPORT.xml";
  }
}
