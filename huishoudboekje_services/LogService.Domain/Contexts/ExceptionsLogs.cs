using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LogService.Database.Contexts;


[Table("exception_logs")]
[Index(nameof(Timestamp))]
public class ExceptionsLogs : DatabaseModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("uuid")]
    public Guid Uuid { get; set; }

    [Column("timestamp")]
    public long Timestamp { get; set; }

    [Column("type")]
    public string Type { get; set; } = null!;

    [Column("message")]
    public string Message { get; set; } = null!;

    [Column("stack_trace")]
    public string StackTrace { get; set; } = null!;
}
