using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;

namespace AlarmService.Domain.Contexts;

[Table("signaltypes")]
public class SignalType : DatabaseModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")] public string Name { get; set; } = null!;
}
