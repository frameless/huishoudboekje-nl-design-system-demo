namespace FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03;

public record TransactionInformation(
  string EndToEndId,
  decimal Amount,
  Receiver Receiver,
  string Description,
  string Currency = "EUR");
