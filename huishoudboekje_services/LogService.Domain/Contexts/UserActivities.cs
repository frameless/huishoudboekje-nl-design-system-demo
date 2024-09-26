using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LogService.Database.Contexts;

[Table("user_activities")]
[Index(nameof(Timestamp))]
public class UserActivities : DatabaseModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Column("timestamp")]
    public long Timestamp { get; set; }

    [Column("user_id")]
    public string? UserId { get; set; }

    [Column("action")]
    public string Action { get; set; } = null!;

    [Column("snapshot_before")]
    public string? SnapshotBefore { get; set; }

    [Column("snapshot_after")]
    public string? SnapshotAfter { get; set; }

    [Column("meta")]
    public string Meta { get; set; } = null!;

    [Column("activity_type")]
    [ForeignKey("UserActivityType")]
    public int Type { get; set; }
    public UserActivityType UserActivityType { get; set; }

    public ICollection<UserActivityEntities> Entities { get; set; } = new List<UserActivityEntities>();

}
