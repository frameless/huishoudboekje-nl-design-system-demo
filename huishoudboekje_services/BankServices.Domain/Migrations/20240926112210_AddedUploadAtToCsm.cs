using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankServices.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddedUploadAtToCsm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "uploaded_at",
                table: "customerstatementmessages",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_customerstatementmessages_uploaded_at",
                table: "customerstatementmessages",
                column: "uploaded_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_customerstatementmessages_uploaded_at",
                table: "customerstatementmessages");

            migrationBuilder.DropColumn(
                name: "uploaded_at",
                table: "customerstatementmessages");
        }
    }
}
