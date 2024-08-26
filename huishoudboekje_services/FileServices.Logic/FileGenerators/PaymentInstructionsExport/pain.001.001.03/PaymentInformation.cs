namespace FileServices.Logic.FileGenerators.PaymentInstructionsExport.pain._001._001._03;

public record PaymentInformation(
  DateTime ExecutionDate,
  IList<TransactionInformation> Transactions,
  decimal TransactionsControlSum,
  Sender? Sender = null,
  string PaymentMethod = "TRF",
  string ChargeBearer = "SLEV",
  bool Batch = false);
