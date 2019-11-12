using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WorkflowExample.Migrations
{
    public partial class _001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AssetPuchase",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    BillId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Specifications = table.Column<string>(nullable: true),
                    Purpose = table.Column<string>(nullable: true),
                    PurchaseQuantity = table.Column<int>(nullable: false),
                    EstimatedAmount = table.Column<double>(nullable: false),
                    InventoryOnHand = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetPuchase", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ITPurchase",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    BillName = table.Column<string>(nullable: true),
                    CompanyName = table.Column<string>(nullable: true),
                    ApplicantId = table.Column<Guid>(nullable: false),
                    ApplicantName = table.Column<string>(nullable: true),
                    DepartmentId = table.Column<string>(nullable: true),
                    DepartmentName = table.Column<string>(nullable: true),
                    ProjectId = table.Column<Guid>(nullable: false),
                    ProjectName = table.Column<string>(nullable: true),
                    CreateTime = table.Column<long>(nullable: false),
                    EstimatedAmount = table.Column<double>(nullable: false),
                    Count = table.Column<int>(nullable: false),
                    HadCount = table.Column<int>(nullable: false),
                    SignatureOfFM = table.Column<string>(nullable: true),
                    DataOfSFM = table.Column<long>(nullable: false),
                    SignatureOfDP = table.Column<string>(nullable: true),
                    DataOfSDP = table.Column<long>(nullable: false),
                    SignatureOfVGM = table.Column<string>(nullable: true),
                    DataOfSVGM = table.Column<long>(nullable: false),
                    SignatureOfGM = table.Column<string>(nullable: true),
                    DataOfSGM = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ITPurchase", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetPuchase");

            migrationBuilder.DropTable(
                name: "ITPurchase");
        }
    }
}
