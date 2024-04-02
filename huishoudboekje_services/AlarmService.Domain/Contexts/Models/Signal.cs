using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AlarmService.Domain.Contexts;

[Table("signals")]
[Index(nameof(CreatedAt))]
public class Signal : DatabaseModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Column("is_active")] public bool IsActive { get; set; }

    [Column("type")]
    [ForeignKey("SignalType")]
    public int Type { get; set; }
    public SignalType SignalType { get; set; } = null!;

    [Column("off_by_amount")] public int OffByAmount { get; set; }

    [Column("updated_at")] public long? UpdatedAt { get; set; }

    [Column("created_at")] public long CreatedAt { get; set; }

    [Column("journal_entry_uuids")] public string? JournalEntryUuids { get; set; }

    [Column("citizen_uuid")] public Guid? CitizenUuid { get; set; }

    [Column("agreement_uuid")] public Guid? AgreementUuid { get; set; }

    [Column("alarm_uuid")]
    [ForeignKey("Alarm")]
    public Guid? AlarmUuid { get; set; }
    public Alarm? Alarm { get; set; }
}
