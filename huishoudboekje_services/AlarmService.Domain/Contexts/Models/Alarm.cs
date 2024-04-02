using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Database.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AlarmService.Domain.Contexts
{
    [Index(nameof(StartDate))]
    [Table("alarms")]
    public partial class Alarm : DatabaseModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("uuid")]
        public Guid Uuid { get; set; }

        [Column("is_active")] public bool IsActive { get; set; }

        [Column("date_margin")] public int DateMargin { get; set; }

        [Column("amount")] public int Amount { get; set; }

        [Column("amount_margin")] public int AmountMargin { get; set; }

        [Column("recurring_months")] public string? RecurringMonths { get; set; }

        [Column("recurring_day_of_month")] public string? RecurringDayOfMonth { get; set; }

        [Column("recurring_day")] public string? RecurringDay { get; set; }

        [Column("check_on_date")] public long? CheckOnDate { get; set; }

        [Column("start_date")] public long StartDate { get; set; }

        [Column("end_date")] public long? EndDate { get; set; }


        [Column("type")]
        [ForeignKey("AlarmType")]
        public int Type { get; set; }
        public AlarmType AlarmType { get; set; } = null!;
    }
}
