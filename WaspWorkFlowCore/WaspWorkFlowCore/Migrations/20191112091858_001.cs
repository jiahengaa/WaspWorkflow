using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WaspWorkFlowCore.Migrations
{
    public partial class _001 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpringTourApply");

            migrationBuilder.AddColumn<string>(
                name: "Desc",
                table: "WFNodeInstance",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Desc",
                table: "WFNodeInstance");

            migrationBuilder.CreateTable(
                name: "SpringTourApply",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Area = table.Column<string>(nullable: true),
                    CounsellorOptions = table.Column<string>(nullable: true),
                    CreateUserId = table.Column<Guid>(nullable: false),
                    CreateUserName = table.Column<string>(nullable: true),
                    HeadTeacherOptions = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    ParticipantNum = table.Column<int>(nullable: false),
                    Price = table.Column<long>(nullable: false),
                    StartTime = table.Column<long>(nullable: false),
                    TotalDay = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpringTourApply", x => x.Id);
                });
        }
    }
}
