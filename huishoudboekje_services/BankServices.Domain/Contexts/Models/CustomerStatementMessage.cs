using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;

namespace BankServices.Domain.Contexts.Models;

[Table("customerstatementmessages")]
public class CustomerStatementMessage : DatabaseModel
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Column("uuid")]
  public Guid Uuid { get; set; }

  [Column("transaction_reference")] public string TransactionReference { get; set; }
  [Column("account_identification")] public string AccountIdentification { get; set; }
  [Column("file_uuid")] public Guid FileUuid { get; set; }

  public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
