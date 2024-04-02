using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LogService.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddExceptionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "exception_logs",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    timestamp = table.Column<long>(type: "bigint", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    stack_trace = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_exception_logs", x => x.uuid);
                });

            migrationBuilder.CreateIndex(
                name: "IX_exception_logs_timestamp",
                table: "exception_logs",
                column: "timestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "exception_logs");
        }
    }
}
