using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LogService.Database.Contexts;

[Table("user_activity_entities")]
[PrimaryKey(nameof(EntityId), nameof(EntityType), "user_activity_uuid")]
public class UserActivityEntities : DatabaseModel
{
    [Column("entity_id")]
    [MaxLength(36)]
    public string EntityId { get; set; } = null!;

    [Column("entity_type")]
    public string EntityType { get; set; } = null!;

    [ForeignKey("user_activity_uuid")]
    public UserActivities UserActivities { get; set; } = null!;
}
