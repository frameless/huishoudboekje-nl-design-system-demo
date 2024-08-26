using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;

namespace BankServices.Domain.Contexts.Models;

[Table("transactions")]
public class Transaction : DatabaseModel
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Column("uuid")]
  public Guid Uuid { get; set; }

  [Column("amount")] public int Amount { get; set; }
  [Column("is_credit")] public bool IsCredit { get; set; }
  [Column("from_account")] public string? FromAccount { get; set; }
  [Column("date")] public long Date { get; set; }
  [Column("information_to_account_owner")] public string InformationToAccountOwner { get; set; }
  [Column("is_reconciled")] public bool IsReconciled { get; set; }

  [Column("customer_statement_message")]
  [ForeignKey("CustomerStatementMessageUuid")]
  public Guid CustomerStatementMessageUuid { get; set; }
  public CustomerStatementMessage CustomerStatementMessage { get; set; } = null!;


}
