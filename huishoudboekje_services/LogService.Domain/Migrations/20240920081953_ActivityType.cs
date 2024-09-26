using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LogService.Database.Migrations
{
    /// <inheritdoc />
    public partial class ActivityType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

          migrationBuilder.CreateTable(
            name: "useractivitytypes",
            columns: table => new
            {
              id = table.Column<int>(type: "integer", nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
              name = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
              table.PrimaryKey("PK_useractivitytypes", x => x.id);
            });

          migrationBuilder.InsertData(
            table: "useractivitytypes",
            columns: new[] { "id", "name" },
            values: new object[,]
            {
              { 1, "Query" }, // Replace with appropriate names
              { 2, "Mutation" } // Replace with appropriate names
            });

            migrationBuilder.AddColumn<int>(
                name: "activity_type",
                table: "user_activities",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.Sql("UPDATE user_activities SET snapshot_before = NULL WHERE snapshot_before = 'None';");
            migrationBuilder.Sql("UPDATE user_activities SET snapshot_after = NULL WHERE snapshot_after = 'None';");
            migrationBuilder.Sql("UPDATE user_activities SET activity_type = 1;");
            migrationBuilder.Sql("UPDATE user_activities SET activity_type = 2 WHERE snapshot_before IS NOT NULL OR snapshot_after IS NOT NULL;");

            migrationBuilder.CreateIndex(
                name: "IX_user_activities_activity_type",
                table: "user_activities",
                column: "activity_type");

            migrationBuilder.AddForeignKey(
                name: "FK_user_activities_useractivitytypes_activity_type",
                table: "user_activities",
                column: "activity_type",
                principalTable: "useractivitytypes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_activities_useractivitytypes_activity_type",
                table: "user_activities");

            migrationBuilder.DropTable(
                name: "useractivitytypes");

            migrationBuilder.DropIndex(
                name: "IX_user_activities_activity_type",
                table: "user_activities");

            migrationBuilder.DropColumn(
                name: "activity_type",
                table: "user_activities");
        }
    }
}
