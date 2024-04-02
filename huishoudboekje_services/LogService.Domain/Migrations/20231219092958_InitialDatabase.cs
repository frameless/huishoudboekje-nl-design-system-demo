using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LogService.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_activities",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    timestamp = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    action = table.Column<string>(type: "text", nullable: false),
                    snapshot_before = table.Column<string>(type: "text", nullable: true),
                    snapshot_after = table.Column<string>(type: "text", nullable: true),
                    meta = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_activities", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "user_activity_entities",
                columns: table => new
                {
                    entity_id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    entity_type = table.Column<string>(type: "text", nullable: false),
                    user_activity_uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_activity_entities", x => new { x.entity_id, x.entity_type, x.user_activity_uuid });
                    table.ForeignKey(
                        name: "FK_user_activity_entities_user_activities_user_activity_uuid",
                        column: x => x.user_activity_uuid,
                        principalTable: "user_activities",
                        principalColumn: "uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_activities_timestamp",
                table: "user_activities",
                column: "timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_user_activity_entities_user_activity_uuid",
                table: "user_activity_entities",
                column: "user_activity_uuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_activity_entities");

            migrationBuilder.DropTable(
                name: "user_activities");
        }
    }
}
