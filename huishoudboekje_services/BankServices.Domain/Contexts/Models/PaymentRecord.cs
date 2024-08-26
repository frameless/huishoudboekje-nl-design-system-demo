using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;

namespace BankServices.Domain.Contexts.Models;

[Table("paymentrecords")]
public partial class PaymentRecord : DatabaseModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Column("amount")] public int Amount { get; set; }
    [Column("created_at")] public long CreatedAt { get; set; }
    [Column("original_processing_date")] public long OriginalProcessingDate { get; set; }

    [ForeignKey("payment_export")]
    [Column("payment_export_uuid")] public Guid? PaymentExportUuid { get; set; }

    [Column("agreement_uuid")] public Guid AgreementUuid { get; set; }

    [Column("processing_date")] public long ProcessingDate { get; set; }
    [Column("account_name")] public string AccountName { get; set; }
    [Column("account_iban")] public string AccountIban { get; set; }
    [Column("description")] public string Description { get; set; }
    [Column("reconciled")] public bool Reconciled { get; set; }
    [Column("transaction_uuid")] public Guid? TransactionUuid { get; set; }
}
