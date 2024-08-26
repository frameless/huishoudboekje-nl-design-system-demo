using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FileServices.Domain.Contexts.Models;

[Index(nameof(UploadedAt))]
[Table("files")]
public class File : DatabaseModel
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Column("uuid")]
  public Guid Uuid { get; set; }

  [Column("sha256")] public string Sha256 { get; set; }
  [Column("name")] public string Name { get; set; }
  [Column("last_modified")] public long LastModified { get; set; }
  [Column("uploaded_at")] public long UploadedAt { get; set; }
  [Column("size")] public int Size { get; set; }
  [Column("bytes")] public byte[] Bytes { get; set; }

  [Column("type")]
  [ForeignKey("FileType")]
  public int Type { get; set; }
  public FileType FileType { get; set; } = null!;
}
