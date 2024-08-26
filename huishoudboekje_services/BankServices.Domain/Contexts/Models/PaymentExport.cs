using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;

namespace BankServices.Domain.Contexts.Models;

[Table("paymentexports")]
public class PaymentExport : DatabaseModel
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Column("uuid")] public Guid Uuid { get; set; }

  [Column("created_at")] public long CreatedAt { get; set; }
  [Column("start_Date")] public long StartDate { get; set; }
  [Column("end_date")] public long EndDate { get; set; }
  [Column("file_uuid")] public Guid FileUuid { get; set; }
  [Column("sha256")] public string Sha256 { get; set; }

  public ICollection<PaymentRecord> Records { get; set; } = new List<PaymentRecord>();
}
