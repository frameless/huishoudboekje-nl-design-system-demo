using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AlarmService.Domain.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alarmtypes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alarmtypes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "signaltypes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_signaltypes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "alarms",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    date_margin = table.Column<int>(type: "integer", nullable: false),
                    amount = table.Column<int>(type: "integer", nullable: false),
                    amount_margin = table.Column<int>(type: "integer", nullable: false),
                    recurring_months = table.Column<string>(type: "text", nullable: true),
                    recurring_day_of_month = table.Column<string>(type: "text", nullable: true),
                    recurring_day = table.Column<string>(type: "text", nullable: true),
                    check_on_date = table.Column<long>(type: "bigint", nullable: true),
                    start_date = table.Column<long>(type: "bigint", nullable: false),
                    end_date = table.Column<long>(type: "bigint", nullable: true),
                    type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alarms", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_alarms_alarmtypes_type",
                        column: x => x.type,
                        principalTable: "alarmtypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "signals",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    off_by_amount = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<long>(type: "bigint", nullable: false),
                    journal_entry_uuids = table.Column<string>(type: "text", nullable: true),
                    citizen_uuid = table.Column<Guid>(type: "uuid", nullable: true),
                    agreement_uuid = table.Column<Guid>(type: "uuid", nullable: true),
                    alarm_uuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_signals", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_signals_alarms_alarm_uuid",
                        column: x => x.alarm_uuid,
                        principalTable: "alarms",
                        principalColumn: "uuid");
                    table.ForeignKey(
                        name: "FK_signals_signaltypes_type",
                        column: x => x.type,
                        principalTable: "signaltypes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "alarmtypes",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Monthly" },
                    { 2, "Weekly" },
                    { 3, "Once" },
                    { 4, "Yearly" }
                });

            migrationBuilder.InsertData(
                table: "signaltypes",
                columns: new[] { "id", "name" },
                values: new object[,]
                {
                    { 1, "Date" },
                    { 2, "Amount" },
                    { 3, "MultipleTransactions" },
                    { 4, "NegativeSaldo" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_alarms_start_date",
                table: "alarms",
                column: "start_date");

            migrationBuilder.CreateIndex(
                name: "IX_alarms_type",
                table: "alarms",
                column: "type");

            migrationBuilder.CreateIndex(
                name: "IX_signals_alarm_uuid",
                table: "signals",
                column: "alarm_uuid");

            migrationBuilder.CreateIndex(
                name: "IX_signals_created_at",
                table: "signals",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_signals_type",
                table: "signals",
                column: "type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "signals");

            migrationBuilder.DropTable(
                name: "alarms");

            migrationBuilder.DropTable(
                name: "signaltypes");

            migrationBuilder.DropTable(
                name: "alarmtypes");
        }
    }
}
