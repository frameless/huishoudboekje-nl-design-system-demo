using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankServices.Domain.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "customerstatementmessages",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    transaction_reference = table.Column<string>(type: "text", nullable: false),
                    account_identification = table.Column<string>(type: "text", nullable: false),
                    file_uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_customerstatementmessages", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "paymentexports",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<long>(type: "bigint", nullable: false),
                    start_Date = table.Column<long>(type: "bigint", nullable: false),
                    end_date = table.Column<long>(type: "bigint", nullable: false),
                    file_uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    sha256 = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymentexports", x => x.uuid);
                });

            migrationBuilder.CreateTable(
                name: "transactions",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<int>(type: "integer", nullable: false),
                    is_credit = table.Column<bool>(type: "boolean", nullable: false),
                    from_account = table.Column<string>(type: "text", nullable: true),
                    date = table.Column<long>(type: "bigint", nullable: false),
                    information_to_account_owner = table.Column<string>(type: "text", nullable: false),
                    is_reconciled = table.Column<bool>(type: "boolean", nullable: false),
                    customer_statement_message = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transactions", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_transactions_customerstatementmessages_customer_statement_m~",
                        column: x => x.customer_statement_message,
                        principalTable: "customerstatementmessages",
                        principalColumn: "uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "paymentrecords",
                columns: table => new
                {
                    uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<long>(type: "bigint", nullable: false),
                    original_processing_date = table.Column<long>(type: "bigint", nullable: false),
                    payment_export_uuid = table.Column<Guid>(type: "uuid", nullable: true),
                    agreement_uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    processing_date = table.Column<long>(type: "bigint", nullable: false),
                    account_name = table.Column<string>(type: "text", nullable: false),
                    account_iban = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    reconciled = table.Column<bool>(type: "boolean", nullable: false),
                    transaction_uuid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymentrecords", x => x.uuid);
                    table.ForeignKey(
                        name: "FK_paymentrecords_paymentexports_payment_export_uuid",
                        column: x => x.payment_export_uuid,
                        principalTable: "paymentexports",
                        principalColumn: "uuid");
                });

            migrationBuilder.CreateIndex(
                name: "IX_paymentrecords_payment_export_uuid",
                table: "paymentrecords",
                column: "payment_export_uuid");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_customer_statement_message",
                table: "transactions",
                column: "customer_statement_message");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "paymentrecords");

            migrationBuilder.DropTable(
                name: "transactions");

            migrationBuilder.DropTable(
                name: "paymentexports");

            migrationBuilder.DropTable(
                name: "customerstatementmessages");
        }
    }
}
