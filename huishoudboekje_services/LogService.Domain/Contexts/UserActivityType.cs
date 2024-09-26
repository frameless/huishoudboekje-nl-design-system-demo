using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;


namespace LogService.Database.Contexts;



[Table("useractivitytypes")]
public partial class UserActivityType : DatabaseModel
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Column("id")]
  public int Id { get; set; }

  [Column("name")] public string Name { get; set; } = null!;
}
